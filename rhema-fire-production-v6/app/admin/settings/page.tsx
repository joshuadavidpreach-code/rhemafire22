import AdminShell from "@/components/AdminShell";
import { prisma } from "@/lib/db";

export default async function AdminSettings() {
  const optins = await prisma.optin.findMany({ orderBy: { createdAt: "desc" }, take: 20 });
  const msgs = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 20 });

  return (
    <AdminShell title="Settings">
      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:16}}>
        <div className="rf-card rf-card--tight">
          <strong>Recent Opt-ins</strong>
          <div className="rf-divider" style={{margin:"12px 0"}} />
          <div style={{display:"grid", gap:8}}>
            {optins.map(o => (
              <div key={o.id} className="rf-card__meta">{o.email} {o.firstName ? `(${o.firstName})` : ""}</div>
            ))}
            {!optins.length ? <div className="rf-card__meta">No opt-ins yet.</div> : null}
          </div>
        </div>

        <div className="rf-card rf-card--tight">
          <strong>Recent Messages</strong>
          <div className="rf-divider" style={{margin:"12px 0"}} />
          <div style={{display:"grid", gap:10}}>
            {msgs.map(m => (
              <div key={m.id} className="rf-card__meta">
                <strong style={{color:"var(--rf-text)"}}>{m.type.toUpperCase()}</strong> — {m.email} — {m.subject || ""}
              </div>
            ))}
            {!msgs.length ? <div className="rf-card__meta">No messages yet.</div> : null}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
