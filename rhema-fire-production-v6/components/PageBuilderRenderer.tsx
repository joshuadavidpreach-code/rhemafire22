type Section =
  | { type: "hero"; heading: string; subheading?: string; primaryText?: string; primaryHref?: string; secondaryText?: string; secondaryHref?: string }
  | { type: "cta"; heading: string; body?: string; buttonText?: string; buttonHref?: string }
  | { type: "features"; heading: string; items: { title: string; body?: string }[] }
  | { type: "cards"; heading: string; cards: { title: string; meta?: string; body?: string; href?: string; buttonText?: string }[] }
  | { type: "html"; html: string };

export default function PageBuilderRenderer({ json }: { json: string }) {
  let sections: Section[] = [];
  try {
    sections = JSON.parse(json || "[]");
  } catch {
    sections = [];
  }

  return (
    <div style={{display:"grid", gap:16}}>
      {sections.map((s, idx) => {
        if (s.type === "hero") {
          return (
            <section key={idx} className="rf-card rf-card--roomy">
              <h2 style={{marginBottom:10}}>{s.heading}</h2>
              {s.subheading ? <p style={{maxWidth:820}}>{s.subheading}</p> : null}
              <div style={{display:"flex", gap:12, flexWrap:"wrap", marginTop:14}}>
                {s.primaryText && s.primaryHref ? <a className="rf-btn rf-btn--primary" href={s.primaryHref}>{s.primaryText}</a> : null}
                {s.secondaryText && s.secondaryHref ? <a className="rf-btn rf-btn--secondary" href={s.secondaryHref}>{s.secondaryText}</a> : null}
              </div>
            </section>
          );
        }

        if (s.type === "cta") {
          return (
            <section key={idx} className="rf-card rf-card--roomy">
              <div className="rf-card__title">{s.heading}</div>
              {s.body ? <p>{s.body}</p> : null}
              {s.buttonText && s.buttonHref ? <a className="rf-btn rf-btn--primary" href={s.buttonHref}>{s.buttonText}</a> : null}
            </section>
          );
        }

        if (s.type === "features") {
          return (
            <section key={idx} className="rf-card rf-card--roomy">
              <div className="rf-card__title">{s.heading}</div>
              <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:12, marginTop:10}}>
                {s.items?.map((it, i) => (
                  <div key={i} className="rf-card rf-card--tight">
                    <strong>{it.title}</strong>
                    {it.body ? <div className="rf-card__meta" style={{marginTop:6}}>{it.body}</div> : null}
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (s.type === "cards") {
          return (
            <section key={idx} className="rf-card rf-card--roomy">
              <div className="rf-card__title">{s.heading}</div>
              <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:12, marginTop:10}}>
                {s.cards?.map((c, i) => (
                  <div key={i} className="rf-card rf-card--tight">
                    <strong>{c.title}</strong>
                    {c.meta ? <div className="rf-card__meta" style={{marginTop:6}}>{c.meta}</div> : null}
                    {c.body ? <p style={{marginTop:10}}>{c.body}</p> : null}
                    {c.href ? <a className="rf-btn rf-btn--secondary" style={{marginTop:10}} href={c.href}>{c.buttonText || "Open"}</a> : null}
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (s.type === "html") {
          return (
            <section key={idx} className="rf-card rf-card--roomy">
              <div dangerouslySetInnerHTML={{ __html: s.html }} />
            </section>
          );
        }

        return null;
      })}
    </div>
  );
}
