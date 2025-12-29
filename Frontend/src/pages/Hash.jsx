import { useState } from "react";
import { API_URL } from "../config";
import { handleFetchError } from "../utils/api";
import { FiCopy } from "react-icons/fi";
import { useSEO } from "../hooks/useSEO";
import TextDropzone from "../components/TextDropzone";

export default function Hash() {
  useSEO({
    title: "Generador de Hash MD5, SHA1, SHA256, SHA512 | Converters Hub",
    description: "Genera hashes MD5, SHA1, SHA256 y SHA512 de texto. Herramienta rápida y segura.",
  });

  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState("sha256");
  const [hashes, setHashes] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const algorithms = [
    { value: "md5", label: "MD5" },
    { value: "sha1", label: "SHA1" },
    { value: "sha256", label: "SHA256" },
    { value: "sha512", label: "SHA512" },
  ];

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/hash`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, algorithm }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al generar hash");
      setHashes((prev) => ({ ...prev, [algorithm]: data.hash }));
    } catch (err) {
      setError(handleFetchError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAll = async () => {
    if (!input.trim()) return;
    setError("");
    setLoading(true);
    const results = {};
    try {
      await Promise.all(
        algorithms.map(async (alg) => {
          const res = await fetch(`${API_URL}/hash`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: input, algorithm: alg.value }),
          });
          const data = await res.json();
          if (res.ok) results[alg.value] = data.hash;
        })
      );
      setHashes(results);
    } catch (err) {
      setError(handleFetchError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (hash, alg) => {
    navigator.clipboard.writeText(hash).then(() => {
      setCopied(alg);
      setTimeout(() => setCopied(""), 2000);
    });
  };

  return (
    <div>
      <div className="hero">
        <h1>Generador de Hash</h1>
        <p>Genera hashes MD5, SHA1, SHA256 y SHA512 de texto de forma rápida y segura.</p>
      </div>

      <div className="card">
        <div className="flex" style={{ marginBottom: "1rem" }}>
          <div className="field" style={{ flex: 1, marginBottom: 0 }}>
            <label>Algoritmo</label>
            <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
              {algorithms.map((alg) => (
                <option key={alg.value} value={alg.value}>
                  {alg.label}
                </option>
              ))}
            </select>
          </div>
          <button className="btn" onClick={handleGenerate} disabled={loading || !input.trim()}>
            Generar {algorithms.find((a) => a.value === algorithm)?.label}
          </button>
          <button className="btn secondary" onClick={handleGenerateAll} disabled={loading || !input.trim()}>
            Generar todos
          </button>
        </div>

        <TextDropzone onText={setInput} accept=".txt" />

        <div className="field">
          <label>Texto</label>
          <textarea
            rows={8}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Texto a hashear..."
          />
        </div>

        {Object.keys(hashes).length > 0 && (
          <div style={{ marginTop: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>Hashes generados</label>
            {algorithms
              .filter((alg) => hashes[alg.value])
              .map((alg) => (
                <div key={alg.value} className="field" style={{ marginBottom: "0.75rem" }}>
                  <div className="flex" style={{ justifyContent: "space-between", alignItems: "center" }}>
                    <label style={{ fontSize: "0.85rem" }}>{alg.label}</label>
                    <button
                      className="btn icon"
                      onClick={() => handleCopy(hashes[alg.value], alg.value)}
                      title="Copiar"
                    >
                      <FiCopy size={14} />
                      {copied === alg.value ? "Copiado!" : ""}
                    </button>
                  </div>
                  <input value={hashes[alg.value]} readOnly style={{ fontFamily: "monospace", fontSize: "0.85rem" }} />
                </div>
              ))}
          </div>
        )}

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

