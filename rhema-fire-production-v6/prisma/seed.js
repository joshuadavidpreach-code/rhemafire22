const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

function youtubeIdFromUrl(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.replace("/", "");
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    const parts = u.pathname.split("/");
    const idx = parts.indexOf("embed");
    if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
  } catch {}
  return "dQw4w9WgXcQ";
}

async function ensureTiers() {
  const tiers = [
    { code: "FREE_MEMBER", name: "Free Member", description: "Free membership access to lessons and community." },
    { code: "MINISTRY_TRACK", name: "Ministry Track", description: "Official track: exams, transcript, standing, ordination pipeline." },
  ];
  for (const t of tiers) {
    await prisma.membershipTier.upsert({
      where: { code: t.code },
      update: { name: t.name, description: t.description },
      create: t,
    });
  }
}

async function grant(userId, code, source="system") {
  const tier = await prisma.membershipTier.findUnique({ where: { code } });
  if (!tier) return;
  // ensure one active entitlement per tier
  const existing = await prisma.userEntitlement.findFirst({ where: { userId, tierId: tier.id, active: true } });
  if (existing) return;
  await prisma.userEntitlement.create({ data: { userId, tierId: tier.id, source, active: true } });
}

async function main() {
  await ensureTiers();

  const email = (process.env.SEED_ADMIN_EMAIL || "admin@rhemafire.local").toLowerCase();
  const passwordPlain = process.env.SEED_ADMIN_PASSWORD || "ChangeMeNow!";
  const passwordHash = await bcrypt.hash(passwordPlain, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { password: passwordHash, role: "ADMIN", name: "Admin" },
    create: { email, password: passwordHash, role: "ADMIN", name: "Admin" },
  });

  await grant(admin.id, "FREE_MEMBER", "system");
  await grant(admin.id, "MINISTRY_TRACK", "admin_override");

// Ensure core pages exist for Page Builder
const corePages = [
  ["home","Home"],
  ["about","About"],
  ["contact","Contact"],
  ["media","Media"]
];
for (const [slug,title] of corePages) {
  await prisma.page.upsert({ where: { slug }, update: {}, create: { title, slug, status:"published", contentHtml:"", contentJson:"[]"} });
}


  await prisma.page.upsert({
    where: { slug: "home" },
    update: {},
    create: { title: "Home", slug: "home", status: "published", contentHtml: "" },
  });

  await prisma.post.upsert({
    where: { slug: "what-is-rhema" },
    update: {},
    create: {
      title: "What is a Rhema Word?",
      slug: "what-is-rhema",
      excerpt: "Rhema is not random emotion—it's the living Word applied by the Spirit, anchored in Scripture.",
      directAnswer:
        "A rhema word is Scripture made alive and applied by the Holy Spirit in a specific moment—never contradicting the written Word.",
      contentHtml:
        "<p><strong>Rhema</strong> is not a mystical replacement for Scripture. It is the Word made living and applied with precision by the Holy Spirit.</p><p>In the New Testament, the Spirit brings the Word to remembrance and drives it into your situation with clarity and conviction.</p>",
      authorId: admin.id,
    },
  });

  const course = await prisma.course.upsert({
    where: { slug: "foundations" },
    update: {},
    create: {
      title: "Foundations of Apostolic Faith",
      slug: "foundations",
      summary: "Salvation, repentance, baptism, Spirit baptism, and discipleship foundations.",
      descriptionHtml: "<p>Built to form disciples with Scripture-first clarity and Spirit-led power.</p>",
    },
  });

  const yt = "https://www.youtube.com/watch?v=9bZkp7q19f0";
  const lessonId = youtubeIdFromUrl(yt);

  await prisma.lesson.upsert({
    where: { courseId_slug: { courseId: course.id, slug: "lesson-1" } },
    update: {},
    create: {
      title: "Lesson 1 — The Gospel and Repentance",
      slug: "lesson-1",
      summaryHtml: "<p>This lesson lays the foundation of the Gospel and the call to repentance.</p>",
      youtubeUrl: yt,
      youtubeId: lessonId,
      transcript: "Intro...\nPoint 1: Repentance is a turning.\nPoint 2: Faith obeys the Word.",
      publicExcerpt: "Repentance is not regret—it's a turning under the authority of Christ.",
      previewEnabled: true,
      previewIndexable: true,
      courseId: course.id,
    },
  });

// Default site settings
const settings = [
  ["siteName","Rhema Fire"],
  ["headerCtaText","Join Free"],
  ["headerCtaHref","/register"],
  ["footerText","Premium ministry platform — Word-anchored, Spirit-led, built for reach and discipleship."],
  ["copyrightText",`© ${new Date().getFullYear()} Rhema Fire`],
  ["blogSidebarHtml","<p><strong>Start Here</strong><br/>Get the free book and join the course library.</p>"],
  ["optInEmbedHtml",""]
];
for (const [key,value] of settings) {
  await prisma.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } });
}

// Example landing pages
const lps = [
  ["free-book-offer","Free Book Offer","<p><strong>Get the book free</strong> and start the journey. Enter your email on the Free Book page or embed your autoresponder form here.</p><p><a href='/free-book'>Go to Free Book</a></p>"],
  ["ministry-track-offer","Ministry Track Offer","<p><strong>Upgrade</strong> for official exams and ordination pathway.</p><p><a href='/ministry-track'>Learn more</a></p>"]
];
for (const [slug,title,contentHtml] of lps) {
  await prisma.landingPage.upsert({ where: { slug }, update: {}, create: { slug, title, contentHtml, status: "published" } });
}


// In-house autoresponder: 10-email drip after opt-in
const seq = await prisma.emailSequence.upsert({
  where: { code: "FREE_BOOK_DRIP_10" },
  update: {},
  create: {
    name: "Free Book Drip (10)",
    code: "FREE_BOOK_DRIP_10",
    description: "10-email welcome + discipleship drip after free book opt-in."
  }
});

const steps = [
  { dayOffset: 0, subject: "Your free book is here — {first_name}", bodyHtml: "<p>Hey {first_name},</p><p>Your free book is ready. (Link goes here.)</p><p>Next step: <a href='https://www.rhemafire.org/start-here'>Start Here</a>.</p>" },
  { dayOffset: 1, subject: "If you're serious about Jesus, you need structure", bodyHtml: "<p>{first_name},</p><p>Hunger is real. Discipline carries it. Here’s your framework: Word, Prayer, Holiness, Mission.</p>" },
  { dayOffset: 2, subject: "The Gospel isn't 'try harder'", bodyHtml: "<p>{first_name},</p><p>The Gospel is Jesus crucified and risen—and your surrender. Reply with: SURRENDER.</p>" },
  { dayOffset: 3, subject: "How disciples read the Bible", bodyHtml: "<p>{first_name},</p><p>Observe. Interpret. Apply. Obey.</p>" },
  { dayOffset: 5, subject: "You were not called to be powerless", bodyHtml: "<p>{first_name},</p><p>The Spirit fills believers for boldness and holiness. Get in the Word.</p>" },
  { dayOffset: 7, subject: "Freedom isn't a trend — it's Jesus", bodyHtml: "<p>{first_name},</p><p>Repent. Renounce. Replace. Remain.</p>" },
  { dayOffset: 9, subject: "You're not just going to heaven", bodyHtml: "<p>{first_name},</p><p>You're being formed for mission. God is building you.</p>" },
  { dayOffset: 12, subject: "Lone believers get picked off", bodyHtml: "<p>{first_name},</p><p>Community isn't optional. Join the training and stay planted.</p>" },
  { dayOffset: 15, subject: "What are you believing God for?", bodyHtml: "<p>{first_name},</p><p>Hit reply and tell me what you're believing for.</p>" },
  { dayOffset: 18, subject: "Your next step — choose it", bodyHtml: "<p>{first_name},</p><p>1) Courses  2) Community  3) Ministry Track</p>" }
];

// Upsert steps by sortOrder
for (let i=0;i<steps.length;i++) {
  const s = steps[i];
  await prisma.emailStep.create({ data: { sequenceId: seq.id, dayOffset: s.dayOffset, subject: s.subject, bodyHtml: s.bodyHtml, sortOrder: i } }).catch(()=>{});
}

  console.log("Seed complete. Admin login:", email, "/", passwordPlain);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
