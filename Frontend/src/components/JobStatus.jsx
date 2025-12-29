import { useEffect, useState } from "react";
import { API_URL } from "../config";
import ProgressBar from "./ProgressBar";
import { FiDownload, FiImage, FiMusic } from "react-icons/fi";

export default function JobStatus({ queue, jobId }) {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!jobId || !queue) return;
    let timer;
    const poll = async () => {
      try {
        const res = await fetch(`${API_URL}/jobs/${queue}/${jobId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error al consultar el estado del proceso");
        setStatus(data);
        if (["completed", "failed"].includes(data.state)) return;
        timer = setTimeout(poll, 2000);
      } catch (err) {
        setError(err.message);
      }
    };
    poll();
    return () => clearTimeout(timer);
  }, [queue, jobId]);

  if (!jobId) return null;
  if (error) return <p style={{ color: "tomato" }}>{error}</p>;
  if (!status) return <p className="muted">Consultando estado del proceso...</p>;

  const getStatusLabel = (state) => {
    const labels = {
      waiting: "En espera",
      active: "Procesando",
      completed: "Completado",
      failed: "Error",
      delayed: "Retrasado",
    };
    return labels[state] || state;
  };

  // Normalizar URLs: reemplazar 0.0.0.0 con localhost para que el navegador pueda acceder
  const normalizeUrl = (url) => {
    if (typeof url === 'string') {
      return url.replace(/http:\/\/0\.0\.0\.0:/g, 'http://localhost:');
    }
    return url;
  };

  // Detectar si hay imágenes en el resultado
  const rawImageUrls = status.returnvalue?.imageUrls || status.returnvalue?.images || [];
  const imageUrls = Array.isArray(rawImageUrls) ? rawImageUrls.map(normalizeUrl) : [];
  const hasImages = imageUrls.length > 0;

  const handleDownload = async (url, index) => {
    try {
      // Usar fetch para descargar como blob y forzar la descarga
      const normalizedUrl = normalizeUrl(url);
      const response = await fetch(normalizedUrl);
      if (!response.ok) throw new Error('Error al descargar la imagen');
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `imagen_${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpiar el blob URL después de un tiempo
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
    } catch (err) {
      console.error('Error descargando imagen:', err);
      // Fallback: abrir en nueva pestaña si falla la descarga
      window.open(normalizeUrl(url), '_blank');
    }
  };

  const handleDownloadAll = () => {
    imageUrls.forEach((url, index) => {
      setTimeout(() => handleDownload(url, index), index * 200);
    });
  };

  return (
    <div className="card" style={{ marginTop: "1rem" }}>
      <p className="muted">Estado del proceso</p>
      <p>
        Estado: <strong>{getStatusLabel(status.state)}</strong>
      </p>
      <ProgressBar
        value={status.progress ?? 0}
        indeterminate={status.progress == null}
        label={`Progreso: ${status.progress ?? 0}%`}
      />
      {status.failedReason && <p style={{ color: "tomato" }}>{status.failedReason}</p>}
      {status.returnvalue && (
        <div style={{ marginTop: "1rem" }}>
          {status.returnvalue.transcription ? (
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                Transcripción:
              </label>
              <div
                style={{
                  padding: "1rem",
                  background: "var(--bg)",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  whiteSpace: "pre-wrap",
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
                {status.returnvalue.transcription}
              </div>
              {status.returnvalue.length && (
                <p className="muted" style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
                  {status.returnvalue.length} caracteres
                </p>
              )}
            </div>
          ) : status.returnvalue?.convertedUrl ? (
            <div>
              <label style={{ display: "flex", marginBottom: "0.5rem", fontWeight: 600, alignItems: "center", gap: "0.5rem" }}>
                {status.returnvalue.format && ['png', 'jpeg', 'jpg', 'webp', 'avif', 'gif', 'tiff', 'bmp'].includes(status.returnvalue.format.toLowerCase()) ? (
                  <FiImage size={18} />
                ) : (
                  <FiMusic size={18} />
                )}
                {status.returnvalue.format && ['png', 'jpeg', 'jpg', 'webp', 'avif', 'gif', 'tiff', 'bmp'].includes(status.returnvalue.format.toLowerCase()) 
                  ? "Imagen convertida:" 
                  : "Audio convertido:"}
              </label>
              <div
                style={{
                  padding: "1rem",
                  background: "var(--bg)",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 500 }}>
                      Formato: {status.returnvalue.originalFormat?.toUpperCase() || 'ORIGINAL'} → {status.returnvalue.outputFormat?.toUpperCase() || status.returnvalue.format?.toUpperCase() || 'CONVERTIDO'}
                    </p>
                    {status.returnvalue.convertedSize && (
                      <p className="muted" style={{ margin: "0.25rem 0 0 0", fontSize: "0.9rem" }}>
                        Tamaño: {(status.returnvalue.convertedSize / 1024 / 1024).toFixed(2)} MB
                        {status.returnvalue.originalSize && (
                          <span> (Original: {(status.returnvalue.originalSize / 1024 / 1024).toFixed(2)} MB)</span>
                        )}
                      </p>
                    )}
                    {status.returnvalue.size && !status.returnvalue.convertedSize && (
                      <p className="muted" style={{ margin: "0.25rem 0 0 0", fontSize: "0.9rem" }}>
                        Tamaño: {(status.returnvalue.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    )}
                  </div>
                  <button
                    className="btn"
                    onClick={async () => {
                      try {
                        const normalizedUrl = normalizeUrl(status.returnvalue.convertedUrl);
                        const response = await fetch(normalizedUrl);
                        if (!response.ok) throw new Error('Error al descargar');
                        const blob = await response.blob();
                        const blobUrl = window.URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = blobUrl;
                        const extension = status.returnvalue.format || status.returnvalue.outputFormat || 'file';
                        link.download = `convertido.${extension}`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(blobUrl);
                      } catch (err) {
                        console.error('Error descargando:', err);
                        window.open(normalizeUrl(status.returnvalue.convertedUrl), '_blank');
                      }
                    }}
                  >
                    <FiDownload size={16} style={{ marginRight: "0.25rem" }} />
                    Descargar
                  </button>
                </div>
                {status.returnvalue.format && ['png', 'jpeg', 'jpg', 'webp', 'avif', 'gif', 'tiff', 'bmp'].includes(status.returnvalue.format.toLowerCase()) ? (
                  <img
                    src={normalizeUrl(status.returnvalue.convertedUrl)}
                    alt="Imagen convertida"
                    style={{ 
                      width: "100%", 
                      maxHeight: "400px", 
                      objectFit: "contain", 
                      marginTop: "0.5rem",
                      borderRadius: "8px",
                      border: "1px solid var(--border)"
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <audio
                    controls
                    src={normalizeUrl(status.returnvalue.convertedUrl)}
                    style={{ width: "100%", marginTop: "0.5rem" }}
                  >
                    Tu navegador no soporta la reproducción de audio.
                  </audio>
                )}
              </div>
            </div>
          ) : hasImages ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <label style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FiImage size={18} />
                  Imágenes generadas: {imageUrls.length}
                </label>
                {imageUrls.length > 1 && (
                  <button className="btn secondary" onClick={handleDownloadAll} style={{ fontSize: "0.9rem" }}>
                    <FiDownload size={16} style={{ marginRight: "0.25rem" }} />
                    Descargar todas
                  </button>
                )}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "1rem",
                  marginTop: "1rem",
                }}
              >
                {imageUrls.map((url, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: "1px solid var(--border)",
                      background: "var(--bg)",
                    }}
                  >
                    <img
                      src={url}
                      alt={`Página ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                        cursor: "pointer",
                      }}
                      onClick={() => window.open(url, "_blank")}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = `<div style="padding: 2rem; text-align: center; color: var(--muted);">Error al cargar imagen</div>`;
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                        padding: "0.5rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ color: "white", fontSize: "0.85rem", fontWeight: 500 }}>
                        Página {index + 1}
                      </span>
                      <button
                        className="btn icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(url, index);
                        }}
                        style={{
                          background: "rgba(255,255,255,0.9)",
                          padding: "0.25rem 0.5rem",
                        }}
                        title="Descargar"
                      >
                        <FiDownload size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {status.returnvalue.format && (
                <p className="muted" style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
                  Formato: {status.returnvalue.format.toUpperCase()}
                </p>
              )}
            </div>
          ) : (
            <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(status.returnvalue, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
}

