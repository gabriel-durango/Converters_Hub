import { useState } from "react";
import { API_URL } from "../config";
import { FiCopy, FiRefreshCw } from "react-icons/fi";
import { useSEO } from "../hooks/useSEO";
import TextDropzone from "../components/TextDropzone";

export default function UrlEncode() {
  useSEO({
    title: "URL Encode/Decode online | Converters Hub",
    description: "Codifica y decodifica URLs. Herramienta rápida para trabajar con parámetros y caracteres especiales.",
  });

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [action, setAction] = useState("encode");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleConvert = async () => {
    if (!input.trim()) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/encode/url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al convertir");
      setOutput(data.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSwap = () => {
    setInput(output);
    setOutput(input);
    setAction(action === "encode" ? "decode" : "encode");
  };

  return (
    <div>
      <div className="hero">
        <h1>URL Encode/Decode</h1>
        <p>Codifica y decodifica URLs para trabajar con parámetros y caracteres especiales.</p>
      </div>

      <div className="card">
        <div className="flex" style={{ marginBottom: "1rem" }}>
          <button
            className={`btn ${action === "encode" ? "" : "secondary"}`}
            onClick={() => setAction("encode")}
          >
            Codificar
          </button>
          <button
            className={`btn ${action === "decode" ? "" : "secondary"}`}
            onClick={() => setAction("decode")}
          >
            Decodificar
          </button>
          <button className="btn secondary" onClick={handleSwap}>
            <FiRefreshCw size={16} />
            Intercambiar
          </button>
        </div>

        <TextDropzone onText={setInput} accept=".txt" />

        <div className="field">
          <label>Entrada</label>
          <textarea
            rows={8}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={action === "encode" ? "URL a codificar..." : "URL codificada a decodificar..."}
          />
        </div>

        <button className="btn" onClick={handleConvert} disabled={loading || !input.trim()}>
          {loading ? "Procesando..." : action === "encode" ? "Codificar" : "Decodificar"}
        </button>

        {output && (
          <div className="field" style={{ marginTop: "1.5rem" }}>
            <div className="flex" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <label>Resultado</label>
              <button className="btn icon" onClick={handleCopy} title="Copiar">
                <FiCopy size={16} />
                {copied ? "Copiado!" : "Copiar"}
              </button>
            </div>
            <textarea rows={8} value={output} readOnly />
          </div>
        )}

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

