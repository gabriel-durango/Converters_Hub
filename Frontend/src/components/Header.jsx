import { Link, NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { FiHome } from "react-icons/fi";

const linkStyle = ({ isActive }) => ({
  color: isActive ? "var(--accent)" : "var(--muted)",
  fontWeight: isActive ? 600 : 500,
  transition: "color 0.2s ease",
});

export default function Header() {
  return (
    <header>
      <div className="shell header-bar">
        <Link to="/" className="brand">
          <img 
            src="/ConverterHub.png" 
            alt="Converters Hub Logo" 
          />
          <span>Converters Hub</span>
        </Link>
        <nav className="nav-links">
          <NavLink style={linkStyle} to="/">
            <FiHome size={16} style={{ marginRight: "0.25rem", verticalAlign: "middle" }} />
            Inicio
          </NavLink>
          <NavLink style={linkStyle} to="/tools/csv-json">
            CSV↔JSON
          </NavLink>
          <NavLink style={linkStyle} to="/tools/normalize">
            Normalizador
          </NavLink>
          <NavLink style={linkStyle} to="/tools/qr">
            QR/Barcodes
          </NavLink>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
