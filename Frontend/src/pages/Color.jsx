import { useState } from "react";
import { API_URL } from "../config";
import { FiCopy } from "react-icons/fi";
import { useSEO } from "../hooks/useSEO";

export default function Color() {
  useSEO({
    title: "Color Converter HEX, RGB, HSL online | Converters Hub",
    description: "Convierte colores entre HEX, RGB y HSL. Herramienta rápida para diseñadores.",
  });

  const [hex, setHex] = useState("#3b82f6");
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });
  const [action, setAction] = useState("hex-to-rgb");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  
  // Calcular todos los formatos cuando cambia el resultado
  const [allFormats, setAllFormats] = useState({
    hex: "#3b82f6",
    rgb: { r: 59, g: 130, b: 246 },
    hsl: { h: 217, s: 91, l: 60 },
  });

  const handleConvert = async () => {
    setError("");
    setLoading(true);
    try {
      const body = { action };
      if (action === "hex-to-rgb") {
        body.hex = hex;
      } else if (action === "rgb-to-hex" || action === "rgb-to-hsl") {
        body.rgb = rgb;
      } else if (action === "hsl-to-rgb") {
        body.hsl = hsl;
      }

      const res = await fetch(`${API_URL}/color/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al convertir");
      setResult(data.result);

      // Usar todos los formatos del backend si están disponibles
      if (data.allFormats) {
        setAllFormats(data.allFormats);
        setHex(data.allFormats.hex);
        setRgb(data.allFormats.rgb);
        setHsl(data.allFormats.hsl);
      } else {
        // Fallback: actualizar según resultado
        if (action === "hex-to-rgb" || action === "hsl-to-rgb") {
          setRgb(data.result);
          setAllFormats(prev => ({ ...prev, rgb: data.result }));
        } else if (action === "rgb-to-hex") {
          setHex(data.result);
          setAllFormats(prev => ({ ...prev, hex: data.result }));
        } else if (action === "rgb-to-hsl") {
          setHsl(data.result);
          setAllFormats(prev => ({ ...prev, hsl: data.result }));
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      setTimeout(() => setCopied(""), 2000);
    });
  };

  const getColorPreview = () => {
    if (action === "hex-to-rgb" || action === "hsl-to-rgb") {
      return `rgb(${result?.r || rgb.r}, ${result?.g || rgb.g}, ${result?.b || rgb.b})`;
    }
    if (action === "rgb-to-hex") {
      return result || hex;
    }
    return hex;
  };

  return (
    <div>
      <div className="hero">
        <h1>Color Converter</h1>
        <p>Convierte colores entre HEX, RGB y HSL de forma rápida.</p>
      </div>

      <div className="card">
        <div className="flex" style={{ marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <button
            className={`btn ${action === "hex-to-rgb" ? "" : "secondary"}`}
            onClick={() => setAction("hex-to-rgb")}
          >
            HEX → RGB
          </button>
          <button
            className={`btn ${action === "rgb-to-hex" ? "" : "secondary"}`}
            onClick={() => setAction("rgb-to-hex")}
          >
            RGB → HEX
          </button>
          <button
            className={`btn ${action === "rgb-to-hsl" ? "" : "secondary"}`}
            onClick={() => setAction("rgb-to-hsl")}
          >
            RGB → HSL
          </button>
          <button
            className={`btn ${action === "hsl-to-rgb" ? "" : "secondary"}`}
            onClick={() => setAction("hsl-to-rgb")}
          >
            HSL → RGB
          </button>
        </div>

        <div
          style={{
            width: "100%",
            height: "120px",
            background: getColorPreview(),
            borderRadius: "12px",
            marginBottom: "1.5rem",
            border: "1px solid var(--border)",
          }}
        />

        {(action === "hex-to-rgb" || action === "hsl-to-rgb") && (
          <div className="field">
            <label>{action === "hex-to-rgb" ? "HEX" : "HSL"}</label>
            {action === "hex-to-rgb" ? (
              <input
                type="text"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                placeholder="#3b82f6"
                style={{ fontFamily: "monospace" }}
              />
            ) : (
              <div className="flex" style={{ gap: "0.5rem" }}>
                <input
                  type="number"
                  min="0"
                  max="360"
                  value={hsl.h}
                  onChange={(e) => setHsl({ ...hsl, h: parseInt(e.target.value) || 0 })}
                  placeholder="H"
                  style={{ flex: 1 }}
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={hsl.s}
                  onChange={(e) => setHsl({ ...hsl, s: parseInt(e.target.value) || 0 })}
                  placeholder="S"
                  style={{ flex: 1 }}
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={hsl.l}
                  onChange={(e) => setHsl({ ...hsl, l: parseInt(e.target.value) || 0 })}
                  placeholder="L"
                  style={{ flex: 1 }}
                />
              </div>
            )}
          </div>
        )}

        {(action === "rgb-to-hex" || action === "rgb-to-hsl") && (
          <div className="field">
            <label>RGB</label>
            <div className="flex" style={{ gap: "0.5rem" }}>
              <input
                type="number"
                min="0"
                max="255"
                value={rgb.r}
                onChange={(e) => setRgb({ ...rgb, r: parseInt(e.target.value) || 0 })}
                placeholder="R"
                style={{ flex: 1 }}
              />
              <input
                type="number"
                min="0"
                max="255"
                value={rgb.g}
                onChange={(e) => setRgb({ ...rgb, g: parseInt(e.target.value) || 0 })}
                placeholder="G"
                style={{ flex: 1 }}
              />
              <input
                type="number"
                min="0"
                max="255"
                value={rgb.b}
                onChange={(e) => setRgb({ ...rgb, b: parseInt(e.target.value) || 0 })}
                placeholder="B"
                style={{ flex: 1 }}
              />
            </div>
          </div>
        )}

        <button className="btn" onClick={handleConvert} disabled={loading}>
          {loading ? "Procesando..." : "Convertir"}
        </button>

        {result && (
          <div style={{ marginTop: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "1rem", fontWeight: 600, fontSize: "1.1rem" }}>
              Todos los formatos
            </label>
            
            {/* HEX */}
            <div className="field" style={{ marginBottom: "0.75rem" }}>
              <div className="flex" style={{ justifyContent: "space-between", alignItems: "center" }}>
                <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>HEX</label>
                <button
                  className="btn icon"
                  onClick={() => handleCopy(allFormats.hex, "hex")}
                  title="Copiar HEX"
                >
                  <FiCopy size={14} />
                  {copied === "hex" ? "Copiado!" : ""}
                </button>
              </div>
              <input
                value={allFormats.hex}
                readOnly
                style={{ fontFamily: "monospace", fontSize: "1.1rem", fontWeight: 600 }}
              />
            </div>
            
            {/* RGB - Siempre mostrar si tenemos RGB */}
            {allFormats.rgb && (
              <div className="field" style={{ marginBottom: "0.75rem" }}>
                <div className="flex" style={{ justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>RGB</label>
                  <button
                    className="btn icon"
                    onClick={() => handleCopy(`rgb(${allFormats.rgb.r}, ${allFormats.rgb.g}, ${allFormats.rgb.b})`, "rgb")}
                    title="Copiar RGB"
                  >
                    <FiCopy size={14} />
                    {copied === "rgb" ? "Copiado!" : ""}
                  </button>
                </div>
                <input
                  value={`rgb(${allFormats.rgb.r}, ${allFormats.rgb.g}, ${allFormats.rgb.b})`}
                  readOnly
                  style={{ fontFamily: "monospace" }}
                />
                <div style={{ marginTop: "0.25rem", fontSize: "0.85rem", color: "var(--muted)" }}>
                  {allFormats.rgb.r}, {allFormats.rgb.g}, {allFormats.rgb.b}
                </div>
              </div>
            )}
            
            {/* HSL - Siempre mostrar si tenemos HSL */}
            {allFormats.hsl && (
              <div className="field" style={{ marginBottom: "0.75rem" }}>
                <div className="flex" style={{ justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>HSL</label>
                  <button
                    className="btn icon"
                    onClick={() => handleCopy(`hsl(${allFormats.hsl.h}, ${allFormats.hsl.s}%, ${allFormats.hsl.l}%)`, "hsl")}
                    title="Copiar HSL"
                  >
                    <FiCopy size={14} />
                    {copied === "hsl" ? "Copiado!" : ""}
                  </button>
                </div>
                <input
                  value={`hsl(${allFormats.hsl.h}, ${allFormats.hsl.s}%, ${allFormats.hsl.l}%)`}
                  readOnly
                  style={{ fontFamily: "monospace" }}
                />
                <div style={{ marginTop: "0.25rem", fontSize: "0.85rem", color: "var(--muted)" }}>
                  {allFormats.hsl.h}°, {allFormats.hsl.s}%, {allFormats.hsl.l}%
                </div>
              </div>
            )}
          </div>
        )}

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

