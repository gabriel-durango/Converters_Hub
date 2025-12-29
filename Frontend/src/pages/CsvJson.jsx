import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API_URL } from "../config";
import TextDropzone from "../components/TextDropzone";
import { useSEO } from "../hooks/useSEO";

const SAMPLE_CSV = `name,role
Ada,Engineer
Bruno,Product
Carla,Data`;

export default function CsvJson() {
  useSEO({
    title: "CSV a JSON online (y viceversa) | Converters Hub",
    description:
      "Convierte CSV a JSON y JSON a CSV con delimitador personalizable. Valida y comparte el resultado.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "CSV a JSON online",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      featureList: ["CSV a JSON", "JSON a CSV", "Delimitador personalizado"],
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const [csvInput, setCsvInput] = useState(SAMPLE_CSV);
  const [jsonOutput, setJsonOutput] = useState("");
  const [delimiter, setDelimiter] = useState(searchParams.get("delim") || ",");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("csv-json:last");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCsvInput(parsed.csv || SAMPLE_CSV);
        setDelimiter(parsed.delimiter || ",");
      } catch {
        /* ignore */
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("csv-json:last", JSON.stringify({ csv: csvInput, delimiter }));
  }, [csvInput, delimiter]);

  const jsonString = useMemo(() => {
    if (!jsonOutput) return "";
    try {
      return JSON.stringify(JSON.parse(jsonOutput), null, 2);
    } catch {
      return jsonOutput;
    }
  }, [jsonOutput]);

  const convertCsv = async () => {
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/convert/csv-json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv: csvInput, delimiter }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al convertir CSV");
      setJsonOutput(JSON.stringify(data.data, null, 2));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const convertJson = async () => {
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/convert/json-csv`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: jsonString, delimiter }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al convertir JSON");
      setCsvInput(data.csv);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    const params = new URLSearchParams({ delim: delimiter });
    setSearchParams(params);
    navigator.clipboard
      .writeText(`${window.location.origin}${window.location.pathname}?${params.toString()}`)
      .then(() => setMessage("Enlace copiado"))
      .catch(() => setMessage("No se pudo copiar el enlace"));
  };

  return (
    <div>
      <div className="hero">
        <h1>CSV ↔ JSON ↔ YAML</h1>
        <p>
          Convierte entre formatos de forma instantánea. Ajusta el delimitador, valida y comparte el resultado.
          Arrastra un archivo o pega tu contenido directamente.
        </p>
      </div>

      <div className="card">
        <div className="flex" style={{ alignItems: "center" }}>
          <div className="field" style={{ flex: "1 1 200px", marginBottom: 0 }}>
            <label>Delimitador</label>
            <input value={delimiter} onChange={(e) => setDelimiter(e.target.value)} maxLength={3} />
          </div>
          <button className="btn" onClick={convertCsv} disabled={loading}>
            {loading ? "Procesando..." : "CSV → JSON"}
          </button>
          <button className="btn secondary" onClick={convertJson} disabled={loading}>
            {loading ? "Procesando..." : "JSON → CSV"}
          </button>
          <button className="btn secondary" onClick={handleShare}>
            Compartir enlace
          </button>
        </div>

        <TextDropzone onText={setCsvInput} />

        <div className="flex">
          <div style={{ flex: 1 }} className="field">
            <label>CSV</label>
            <textarea rows={12} value={csvInput} onChange={(e) => setCsvInput(e.target.value)} />
          </div>
          <div style={{ flex: 1 }} className="field">
            <label>JSON</label>
            <textarea
              rows={12}
              value={jsonString}
              onChange={(e) => setJsonOutput(e.target.value)}
            />
          </div>
        </div>
        {error && <p style={{ color: "tomato" }}>{error}</p>}
        {message && <p className="muted">{message}</p>}
      </div>
    </div>
  );
}

