import { useTheme } from "../theme/ThemeProvider";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button className="btn icon" onClick={toggle} aria-label="Cambiar tema">
      {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
    </button>
  );
}
