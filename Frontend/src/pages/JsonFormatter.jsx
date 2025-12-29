import { useState } from "react";
import { API_URL } from "../config";
import { FiCopy, FiCheck, FiX } from "react-icons/fi";
import { useSEO } from "../hooks/useSEO";
import TextDropzone from "../components/TextDropzone";

export default function JsonFormatter() {
  useSEO({
    title: "JSON Formatter, Validator y Minifier online | Converters Hub",
    description: "Formatea, valida y minifica JSON. Herramienta rápida para trabajar con JSON.",
  });

  const [input, setInput] = useState('{"name":"test","value":123}');
  const [output, setOutput] = useState("");
  const [action, setAction] = useState("format");
  const [indent, setIndent] = useState(2);
  const [validation, setValidation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFormat = async () => {
    if (!input.trim()) return;
    setError("");
    setValidation(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/json/format`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: input, action, indent: action === "format" ? indent : undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al procesar JSON");
      if (action === "validate") {
        setValidation(data);
      } else {
        setOutput(data.result);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output || input).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div>
      <div className="hero">
        <h1>JSON Formatter, Validator y Minifier</h1>
        <p>Formatea, valida y minifica JSON de forma rápida y segura.</p>
      </div>

      <div className="card">
        <div className="flex" style={{ marginBottom: "1rem", flexWrap: "wrap" }}>
          <button
            className={`btn ${action === "format" ? "" : "secondary"}`}
            onClick={() => setAction("format")}
          >
            Formatear
          </button>
          <button
            className={`btn ${action === "minify" ? "" : "secondary"}`}
            onClick={() => setAction("minify")}
          >
            Minificar
          </button>
          <button
            className={`btn ${action === "validate" ? "" : "secondary"}`}
            onClick={() => setAction("validate")}
          >
            Validar
          </button>
          {action === "format" && (
            <div className="field" style={{ flex: "0 0 120px", marginBottom: 0 }}>
              <label style={{ fontSize: "0.8rem" }}>Indentación</label>
              <input
                type="number"
                min="0"
                max="8"
                value={indent}
                onChange={(e) => setIndent(parseInt(e.target.value) || 2)}
                style={{ padding: "0.5rem" }}
              />
            </div>
          )}
        </div>

        <TextDropzone onText={setInput} accept=".json,.txt" />

        <div className="field">
          <label>JSON</label>
          <textarea
            rows={12}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key":"value"}'
            style={{ fontFamily: "monospace" }}
          />
        </div>

        <button className="btn" onClick={handleFormat} disabled={loading || !input.trim()}>
          {loading ? "Procesando..." : action === "format" ? "Formatear" : action === "minify" ? "Minificar" : "Validar"}
        </button>

        {validation && (
          <div style={{ marginTop: "1.5rem", padding: "1rem", background: "var(--bg)", borderRadius: "12px", border: `1px solid ${validation.valid ? "var(--success)" : "var(--error)"}` }}>
            <div className="flex" style={{ alignItems: "center", gap: "0.5rem" }}>
              {validation.valid ? <FiCheck size={20} className="success" /> : <FiX size={20} className="error" />}
              <strong>{validation.valid ? "JSON válido" : "JSON inválido"}</strong>
            </div>
            {validation.error && <p className="error" style={{ marginTop: "0.5rem" }}>{validation.error}</p>}
          </div>
        )}

        {output && (
          <div className="field" style={{ marginTop: "1.5rem" }}>
            <div className="flex" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <label>Resultado</label>
              <button className="btn icon" onClick={handleCopy} title="Copiar">
                <FiCopy size={16} />
                {copied ? "Copiado!" : "Copiar"}
              </button>
            </div>
            <textarea rows={12} value={output} readOnly style={{ fontFamily: "monospace" }} />
          </div>
        )}

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

