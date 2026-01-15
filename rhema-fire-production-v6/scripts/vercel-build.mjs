import { spawnSync } from "node:child_process";

function pick(...vals) {
  return vals.find((v) => typeof v === "string" && v.trim().length > 0);
}

const databaseUrl =
  process.env.DATABASE_URL ||
  pick(
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL,
    process.env.POSTGRES_URL_NO_SSL,
    process.env.POSTGRES_URL_NON_POOLING
  );

const directUrl =
  process.env.DIRECT_URL ||
  pick(
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.POSTGRES_URL,
    process.env.POSTGRES_URL_NO_SSL
  );

if (!databaseUrl) {
  console.error("\n❌ Missing DATABASE_URL (or Vercel Postgres env vars).");
  console.error("Fix: Vercel → Project → Settings → Environment Variables → add DATABASE_URL.");
  console.error("If using Vercel Postgres Storage, attach it to the project and redeploy.\n");
  process.exit(1);
}

process.env.DATABASE_URL = databaseUrl;
if (directUrl) process.env.DIRECT_URL = directUrl;

function run(cmd, args) {
  console.log(`\n▶ ${cmd} ${args.join(" ")}`);
  const r = spawnSync(cmd, args, { stdio: "inherit", env: process.env });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

run("npx", ["prisma", "generate"]);
run("npx", ["prisma", "migrate", "deploy"]);
run("npx", ["next", "build"]);

console.log("\n✅ vercel-build complete");
