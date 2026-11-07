export default function SectionHeading({ kicker, title, description }: { kicker: string; title: string; description?: string }) {
  return <div className="section-head"><p className="kicker">{kicker}</p><h1>{title}</h1>{description && <p className="section-sub">{description}</p>}</div>
}
