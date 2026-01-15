"use client";

import { useEffect, useMemo, useState } from "react";
import AdminShellClient from "@/components/AdminShellClient";
import PageBuilderRenderer from "@/components/PageBuilderRenderer";

type Section =
  | { type: "hero"; heading: string; subheading?: string; primaryText?: string; primaryHref?: string; secondaryText?: string; secondaryHref?: string }
  | { type: "cta"; heading: string; body?: string; buttonText?: string; buttonHref?: string }
  | { type: "features"; heading: string; items: { title: string; body?: string }[] }
  | { type: "cards"; heading: string; cards: { title: string; meta?: string; body?: string; href?: string; buttonText?: string }[] }
  | { type: "html"; html: string };

export default function PageBuilder({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const [title, setTitle] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [directAnswer, setDirectAnswer] = useState("");
  const [sections, setSections] = useState<Section[]>([]);
  const [status, setStatus] = useState<"idle"|"saving"|"saved"|"error">("idle");
  const json = useMemo(() => JSON.stringify(sections, null, 2), [sections]);

  useEffect(() => {
    fetch(`/api/admin/pages/${slug}`)
      .then(r => r.json())
      .then(d => {
        setTitle(d.title || slug);
        setMetaTitle(d.metaTitle || "");
        setMetaDesc(d.metaDesc || "");
        setDirectAnswer(d.directAnswer || "");
        setSections(d.contentJson ? JSON.parse(d.contentJson) : []);
      })
      .catch(() => {});
  }, [slug]);

  function add(type: Section["type"]) {
    if (type === "hero") setSections(s => [...s, { type:"hero", heading:"New Hero", subheading:"", primaryText:"Join Free", primaryHref:"/register", secondaryText:"Free Book", secondaryHref:"/free-book" }]);
    if (type === "cta") setSections(s => [...s, { type:"cta", heading:"Call to Action", body:"", buttonText:"Get Started", buttonHref:"/start-here" }]);
    if (type === "features") setSections(s => [...s, { type:"features", heading:"Features", items:[{title:"Feature 1", body:""} , {title:"Feature 2", body:""} , {title:"Feature 3", body:""}] }]);
    if (type === "cards") setSections(s => [...s, { type:"cards", heading:"Cards", cards:[{title:"Card 1", body:"", href:"/free-book", buttonText:"Open"}] }]);
    if (type === "html") setSections(s => [...s, { type:"html", html:"<p>Custom HTML…</p>" }]);
  }

  function move(i:number, dir:-1|1) {
    setSections(prev => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const copy = [...prev];
      const tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
      return copy;
    });
  }

  function remove(i:number) {
    setSections(prev => prev.filter((_, idx) => idx !== i));
  }

  async function save() {
    setStatus("saving");
    const res = await fetch(`/api/admin/pages/${slug}`, {
      method: "PUT",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ title, metaTitle, metaDesc, directAnswer, contentJson: json }),
    });
    setStatus(res.ok ? "saved" : "error");
    setTimeout(() => setStatus("idle"), 1500);
  }

  const livePath = slug === "home" ? "/" : `/${slug}`;

  return (
    <AdminShellClient title={`Page Builder: ${slug}`}>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16}}>
        <div>
          <div className="rf-field">
            <label className="rf-label">Title</label>
            <input className="rf-input" value={title} onChange={e=>setTitle(e.target.value)} />
          </div>

          <div className="rf-field">
            <label className="rf-label">SEO Meta Title</label>
            <input className="rf-input" value={metaTitle} onChange={e=>setMetaTitle(e.target.value)} />
          </div>

          <div className="rf-field">
            <label className="rf-label">SEO Meta Description</label>
            <textarea className="rf-textarea" rows={3} value={metaDesc} onChange={e=>setMetaDesc(e.target.value)} />
          </div>

          <div className="rf-field">
            <label className="rf-label">AEO Direct Answer (2–4 sentences)</label>
            <textarea className="rf-textarea" rows={3} value={directAnswer} onChange={e=>setDirectAnswer(e.target.value)} />
          </div>

          <div style={{display:"flex", gap:8, flexWrap:"wrap", marginBottom:12}}>
            <button className="rf-btn rf-btn--secondary" type="button" onClick={()=>add("hero")}>+ Hero</button>
            <button className="rf-btn rf-btn--secondary" type="button" onClick={()=>add("cta")}>+ CTA</button>
            <button className="rf-btn rf-btn--secondary" type="button" onClick={()=>add("features")}>+ Features</button>
            <button className="rf-btn rf-btn--secondary" type="button" onClick={()=>add("cards")}>+ Cards</button>
            <button className="rf-btn rf-btn--secondary" type="button" onClick={()=>add("html")}>+ HTML</button>
          </div>

          <div style={{display:"grid", gap:10}}>
            {sections.map((s, i) => (
              <div key={i} className="rf-card rf-card--tight">
                <div style={{display:"flex", justifyContent:"space-between", gap:10, alignItems:"center"}}>
                  <strong>{i+1}. {s.type.toUpperCase()}</strong>
                  <div style={{display:"flex", gap:6}}>
                    <button className="rf-btn rf-btn--secondary" style={{padding:"8px 10px"}} type="button" onClick={()=>move(i,-1)}>↑</button>
                    <button className="rf-btn rf-btn--secondary" style={{padding:"8px 10px"}} type="button" onClick={()=>move(i,1)}>↓</button>
                    <button className="rf-btn rf-btn--secondary" style={{padding:"8px 10px"}} type="button" onClick={()=>remove(i)}>✕</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rf-field" style={{marginTop:12}}>
            <label className="rf-label">Builder JSON (advanced)</label>
            <textarea className="rf-textarea" rows={14} value={json} onChange={e=>{
              try { setSections(JSON.parse(e.target.value)); } catch {}
            }} />
          </div>

          <div style={{display:"flex", gap:12, alignItems:"center"}}>
            <button className="rf-btn rf-btn--primary" type="button" onClick={save}>Save</button>
            <span className="rf-card__meta">{status === "saving" ? "Saving…" : status === "saved" ? "Saved." : status === "error" ? "Error" : ""}</span>
            <a className="rf-btn rf-btn--secondary" href={livePath} target="_blank" rel="noreferrer">Open Live</a>
          </div>
        </div>

        <div>
          <div className="rf-card rf-card--roomy">
            <div className="rf-card__title">Live Preview</div>
            <PageBuilderRenderer json={json} />
          </div>
        </div>
      </div>
    </AdminShellClient>
  );
}
