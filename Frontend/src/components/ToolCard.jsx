import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

export default function ToolCard({ title, description, href, icon: Icon, cta = "Abrir" }) {
  return (
    <article className="card" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {Icon && <Icon size={32} style={{ color: "var(--accent)", marginBottom: "0.25rem" }} />}
      <h3 className="card-title">{title}</h3>
      <p className="muted" style={{ flex: 1 }}>{description}</p>
      <Link className="btn secondary" to={href} style={{ alignSelf: "flex-start" }}>
        {cta}
        <FiArrowRight size={16} />
      </Link>
    </article>
  );
}
