import { useState } from "react";
import { API_URL } from "../config";
import { handleFetchError } from "../utils/api";
import TextDropzone from "../components/TextDropzone";
import { useSEO } from "../hooks/useSEO";

const SAMPLE = `  Juan  
juan
MARÍA
 maria `;

export default function Normalize() {
  useSEO({
    title: "Normalizador de texto online | Converters Hub",
    description: "Limpia texto con trim, dedup y mayúsculas/minúsculas. Normaliza listas y datos de forma rápida.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Normalizador de texto",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      featureList: ["Trim", "Dedup", "Lowercase/Uppercase"],
    },
  });

  const [text, setText] = useState(SAMPLE);
  const [normalized, setNormalized] = useState("");
  const [trim, setTrim] = useState(true);
  const [dedup, setDedup] = useState(true);
  const [casing, setCasing] = useState("none");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const normalize = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/normalize/text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, trim, dedup, casing }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al normalizar");
      setNormalized(data.normalized);
    } catch (err) {
      setError(handleFetchError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="hero">
        <h1>Normalizador de texto</h1>
        <p>Limpia y normaliza listas: elimina espacios, duplicados y ajusta mayúsculas/minúsculas.</p>
      </div>
      <div className="card">
        <div className="flex" style={{ alignItems: "center" }}>
          <label>
            <input type="checkbox" checked={trim} onChange={(e) => setTrim(e.target.checked)} /> Eliminar espacios
          </label>
          <label>
            <input type="checkbox" checked={dedup} onChange={(e) => setDedup(e.target.checked)} /> Eliminar duplicados
          </label>
          <select value={casing} onChange={(e) => setCasing(e.target.value)}>
            <option value="none">Sin cambio</option>
            <option value="lower">Minúsculas</option>
            <option value="upper">MAYÚSCULAS</option>
          </select>
          <button className="btn" onClick={normalize} disabled={loading}>
            {loading ? "Procesando..." : "Normalizar"}
          </button>
        </div>

        <TextDropzone onText={setText} />

        <div className="flex">
          <div className="field" style={{ flex: 1 }}>
            <label>Entrada</label>
            <textarea rows={10} value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label>Salida</label>
            <textarea rows={10} value={normalized} readOnly placeholder="Resultado..." />
          </div>
        </div>
        {error && <p style={{ color: "tomato" }}>{error}</p>}
      </div>
    </div>
  );
}

