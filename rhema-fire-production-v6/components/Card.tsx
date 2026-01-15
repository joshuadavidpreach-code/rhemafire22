export default function Card({ title, meta, children }: { title: string; meta?: string; children?: React.ReactNode }) {
  return (
    <div className="rf-card rf-card--roomy">
      <div className="rf-card__title">{title}</div>
      {meta ? <div className="rf-card__meta" style={{marginBottom:14}}>{meta}</div> : null}
      {children}
    </div>
  );
}
