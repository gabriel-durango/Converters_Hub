import { useState, useEffect } from "react";
import { API_URL } from "../config";
import { FiCopy, FiRefreshCw } from "react-icons/fi";
import { useSEO } from "../hooks/useSEO";

export default function Timestamp() {
  useSEO({
    title: "Timestamp Converter online | Converters Hub",
    description: "Convierte timestamps Unix a fechas y viceversa. Herramienta rápida para trabajar con fechas.",
  });

  const [timestamp, setTimestamp] = useState("");
  const [date, setDate] = useState("");
  const [action, setAction] = useState("to-date");
  const [format, setFormat] = useState("iso");
  const [unit, setUnit] = useState("seconds");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (action === "now") {
      handleNow();
    }
  }, [action]);

  const handleConvert = async () => {
    setError("");
    setLoading(true);
    try {
      const body = { action, format, unit };
      if (action === "to-date" && timestamp) {
        body.timestamp = timestamp;
      } else if (action === "to-timestamp" && date) {
        body.date = date;
      } else if (action !== "now") {
        throw new Error("Datos requeridos");
      }

      const res = await fetch(`${API_URL}/timestamp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al convertir");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNow = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/timestamp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "now", format, unit }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      setResult(data);
      setTimestamp(data.timestamp.toString());
      setDate(data.date);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div>
      <div className="hero">
        <h1>Timestamp Converter</h1>
        <p>Convierte timestamps Unix a fechas y viceversa de forma rápida.</p>
      </div>

      <div className="card">
        <div className="flex" style={{ marginBottom: "1rem", flexWrap: "wrap" }}>
          <button
            className={`btn ${action === "to-date" ? "" : "secondary"}`}
            onClick={() => setAction("to-date")}
          >
            Timestamp → Fecha
          </button>
          <button
            className={`btn ${action === "to-timestamp" ? "" : "secondary"}`}
            onClick={() => setAction("to-timestamp")}
          >
            Fecha → Timestamp
          </button>
          <button
            className={`btn ${action === "now" ? "" : "secondary"}`}
            onClick={() => setAction("now")}
          >
            Ahora
          </button>
        </div>

        {action === "to-date" && (
          <div className="field">
            <label>Timestamp</label>
            <input
              type="text"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              placeholder="1699123456"
            />
          </div>
        )}

        {action === "to-timestamp" && (
          <div className="field">
            <label>Fecha</label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="2023-11-04T12:30:00Z"
            />
          </div>
        )}

        <div className="flex" style={{ marginBottom: "1rem", flexWrap: "wrap" }}>
          <div className="field" style={{ flex: "0 0 150px", marginBottom: 0 }}>
            <label>Formato</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="iso">ISO</option>
              <option value="locale">Local</option>
              <option value="date">Solo fecha</option>
              <option value="time">Solo hora</option>
            </select>
          </div>
          <div className="field" style={{ flex: "0 0 150px", marginBottom: 0 }}>
            <label>Unidad</label>
            <select value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="seconds">Segundos</option>
              <option value="milliseconds">Milisegundos</option>
            </select>
          </div>
        </div>

        <button className="btn" onClick={handleConvert} disabled={loading}>
          {loading ? "Procesando..." : "Convertir"}
        </button>

        {result && (
          <div style={{ marginTop: "1.5rem" }}>
            <div className="field">
              <div className="flex" style={{ justifyContent: "space-between", alignItems: "center" }}>
                <label>Timestamp</label>
                <button className="btn icon" onClick={() => handleCopy(result.timestamp.toString())} title="Copiar">
                  <FiCopy size={14} />
                  {copied ? "Copiado!" : ""}
                </button>
              </div>
              <input value={result.timestamp} readOnly style={{ fontFamily: "monospace" }} />
            </div>
            <div className="field">
              <div className="flex" style={{ justifyContent: "space-between", alignItems: "center" }}>
                <label>Fecha</label>
                <button className="btn icon" onClick={() => handleCopy(result.date)} title="Copiar">
                  <FiCopy size={14} />
                  {copied ? "Copiado!" : ""}
                </button>
              </div>
              <input value={result.date} readOnly style={{ fontFamily: "monospace" }} />
            </div>
          </div>
        )}

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

