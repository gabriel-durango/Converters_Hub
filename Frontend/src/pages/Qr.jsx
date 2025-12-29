import { useState } from "react";
import { API_URL } from "../config";
import { handleFetchError } from "../utils/api";
import { useSEO } from "../hooks/useSEO";

export default function Qr() {
  useSEO({
    title: "Generador QR y códigos de barras online | Converters Hub",
    description: "Crea códigos QR y barcodes desde texto o URL. Genera códigos listos para compartir o incrustar.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Generador QR y Barcodes",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      featureList: ["QR", "Barcode", "Data URL"],
    },
  });

  const [text, setText] = useState("https://example.com");
  const [qr, setQr] = useState("");
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const [qrRes, barRes] = await Promise.all([
        fetch(`${API_URL}/qr`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        }),
        fetch(`${API_URL}/barcode`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        }),
      ]);
      const qrJson = await qrRes.json();
      const barJson = await barRes.json();
      if (!qrRes.ok) throw new Error(qrJson.error || "Error generando QR");
      if (!barRes.ok) throw new Error(barJson.error || "Error generando barcode");
      setQr(qrJson.dataUrl);
      setBarcode(barJson.dataUrl);
    } catch (err) {
      setError(handleFetchError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="hero">
        <h1>QR y códigos de barras</h1>
        <p>Genera QR y barcodes listos para compartir o incrustar.</p>
      </div>
      <div className="card">
        <div className="field">
          <label>Texto o URL</label>
          <input value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <button className="btn" onClick={generate} disabled={loading} style={{ marginTop: "1rem" }}>
          {loading ? "Procesando..." : "Generar"}
        </button>
        {error && <p style={{ color: "tomato" }}>{error}</p>}

        <div className="flex" style={{ marginTop: "1rem" }}>
          <div className="card" style={{ flex: 1 }}>
            <p className="muted">Código QR</p>
            {qr ? <img src={qr} alt="QR" style={{ width: "100%" }} /> : <p className="muted">Genera un código para verlo aquí</p>}
          </div>
          <div className="card" style={{ flex: 1 }}>
            <p className="muted">Código de barras</p>
            {barcode ? (
              <img src={barcode} alt="Barcode" style={{ width: "100%" }} />
            ) : (
              <p className="muted">Genera un código para verlo aquí</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

