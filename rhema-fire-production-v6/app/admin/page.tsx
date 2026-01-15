import AdminShell from "@/components/AdminShell";
import { prisma } from "@/lib/db";

export default async function AdminHome() {
  const counts = await Promise.all([
    prisma.post.count(),
    prisma.course.count(),
    prisma.lesson.count(),
    prisma.optin.count(),
    prisma.contactMessage.count(),
  ]);

  return (
    <AdminShell title="Dashboard">
      <p className="rf-card__meta">Clickable admin system (CRUD) — publish content and it appears on the public site.</p>

      <div className="rf-divider" style={{margin:"14px 0"}} />

      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:12}}>
        <div className="rf-card rf-card--tight"><strong>Posts</strong><div className="rf-card__meta">{counts[0]}</div></div>
        <div className="rf-card rf-card--tight"><strong>Courses</strong><div className="rf-card__meta">{counts[1]}</div></div>
        <div className="rf-card rf-card--tight"><strong>Lessons</strong><div className="rf-card__meta">{counts[2]}</div></div>
        <div className="rf-card rf-card--tight"><strong>Opt-ins</strong><div className="rf-card__meta">{counts[3]}</div></div>
        <div className="rf-card rf-card--tight"><strong>Messages</strong><div className="rf-card__meta">{counts[4]}</div></div>
      </div>
    </AdminShell>
  );
}
