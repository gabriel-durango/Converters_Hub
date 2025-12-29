import { useState } from "react";
import { API_URL } from "../config";
import { FiCopy, FiRefreshCw } from "react-icons/fi";
import { useSEO } from "../hooks/useSEO";
import TextDropzone from "../components/TextDropzone";

export default function XmlJson() {
  useSEO({
    title: "JSON a XML Converter online | Converters Hub",
    description: "Convierte JSON a XML de forma rápida y sencilla.",
  });

  const [input, setInput] = useState('{"name":"test","value":123}');
  const [output, setOutput] = useState("");
  const [rootElement, setRootElement] = useState("root");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleConvert = async () => {
    if (!input.trim()) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/convert/json-xml`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: input, rootElement }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al convertir");
      setOutput(data.xml);
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

  return (
    <div>
      <div className="hero">
        <h1>JSON a XML</h1>
        <p>Convierte JSON a XML de forma rápida y sencilla.</p>
      </div>

      <div className="card">
        <div className="field" style={{ maxWidth: "200px" }}>
          <label>Elemento raíz</label>
          <input
            value={rootElement}
            onChange={(e) => setRootElement(e.target.value)}
            placeholder="root"
          />
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

        <button className="btn" onClick={handleConvert} disabled={loading || !input.trim()}>
          {loading ? "Procesando..." : "Convertir a XML"}
        </button>

        {output && (
          <div className="field" style={{ marginTop: "1.5rem" }}>
            <div className="flex" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <label>XML</label>
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

