import { useState } from "react";
import { API_URL } from "../config";
import FileDropzone from "../components/FileDropzone";
import { useSEO } from "../hooks/useSEO";
import { FiFile, FiX, FiDownload } from "react-icons/fi";
import ProgressBar from "../components/ProgressBar";

export default function XlsxConvert() {
  useSEO({
    title: "Convertidor XLSX a CSV/JSON online | Converters Hub",
    description: "Convierte archivos Excel (XLSX) a CSV o JSON de forma rápida y sencilla.",
  });

  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [outputFormat, setOutputFormat] = useState("csv");
  const [delimiter, setDelimiter] = useState(",");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFile = async (selectedFile) => {
    if (!selectedFile) {
      setFile(null);
      setUploadedFileUrl("");
      setResult(null);
      setError("");
      return;
    }

    setFile(selectedFile);
    setUploadedFileUrl("");
    setResult(null);
    setError("");
    
    // Subir automáticamente el archivo
    await uploadFile(selectedFile);
  };

  const uploadFile = async (fileToUpload) => {
    if (!fileToUpload) return;

    setError("");
    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", fileToUpload);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percent);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          setUploadedFileUrl(data.fileUrl);
          setUploadProgress(100);
          setShowSuccess(true);
          setTimeout(() => setUploadProgress(0), 500);
          setTimeout(() => setShowSuccess(false), 3000);
        } else {
          const errorData = JSON.parse(xhr.responseText);
          setError(errorData.error || "Error al subir el archivo");
        }
        setUploading(false);
      });

      xhr.addEventListener("error", () => {
        setError("Error de red al subir el archivo");
        setUploading(false);
        setUploadProgress(0);
      });

      xhr.open("POST", `${API_URL}/upload`);
      xhr.send(formData);
    } catch (err) {
      setError(err.message);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadedFileUrl("");
    setResult(null);
    setError("");
  };

  const convert = async () => {
    if (!file) {
      setError("Por favor sube un archivo primero");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const endpoint = outputFormat === "csv" 
        ? `${API_URL}/convert/xlsx-csv?delimiter=${encodeURIComponent(delimiter)}`
        : `${API_URL}/convert/xlsx-json`;

      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al convertir el archivo");
      
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;

    let content, mimeType, extension;
    
    if (outputFormat === "csv") {
      content = result.csv;
      mimeType = "text/csv";
      extension = "csv";
    } else {
      content = JSON.stringify(result.data, null, 2);
      mimeType = "application/json";
      extension = "json";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${file.name.replace(/\.[^/.]+$/, "")}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="hero">
        <h1>Convertidor XLSX</h1>
        <p>Convierte archivos Excel (XLSX) a CSV o JSON de forma rápida y sencilla.</p>
      </div>
      <div className="card">
        <FileDropzone
          onFile={handleFile}
          accept=".xlsx,.xls"
          maxSize={50 * 1024 * 1024}
          label="Arrastra un archivo XLSX o haz clic para cargar"
        />

        {file && (
          <div style={{ marginTop: "1rem", padding: "0.75rem", background: "var(--bg)", borderRadius: "8px" }}>
            <div className="flex" style={{ alignItems: "center", justifyContent: "space-between" }}>
              <div className="flex" style={{ alignItems: "center", gap: "0.5rem" }}>
                <FiFile size={16} />
                <span style={{ fontSize: "0.9rem" }}>{file.name}</span>
                <span className="muted" style={{ fontSize: "0.85rem" }}>
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <button className="btn icon" onClick={handleRemoveFile} title="Eliminar">
                <FiX size={16} />
              </button>
            </div>
          </div>
        )}

        {file && !uploadedFileUrl && uploading && (
          <ProgressBar value={uploadProgress} label="Subiendo archivo" style={{ marginTop: "1rem" }} />
        )}

        {showSuccess && uploadedFileUrl && (
          <div style={{ 
            marginTop: "1rem", 
            padding: "0.75rem 1rem", 
            background: "var(--success)", 
            borderRadius: "8px", 
            border: "1px solid var(--success)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <span style={{ fontSize: "1rem" }}>✓</span>
            <span style={{ fontSize: "0.9rem", color: "var(--success)", fontWeight: 500 }}>
              Archivo subido correctamente
            </span>
          </div>
        )}

        {file && (
          <>
            <div className="field" style={{ marginTop: "1rem" }}>
              <label>Formato de salida</label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
              >
                <option value="csv">CSV</option>
                <option value="json">JSON</option>
              </select>
            </div>

            {outputFormat === "csv" && (
              <div className="field" style={{ marginTop: "1rem" }}>
                <label>Delimitador</label>
                <select
                  value={delimiter}
                  onChange={(e) => setDelimiter(e.target.value)}
                >
                  <option value=",">Coma (,)</option>
                  <option value=";">Punto y coma (;)</option>
                  <option value="\t">Tabulador</option>
                  <option value="|">Pipe (|)</option>
                </select>
              </div>
            )}
          </>
        )}

        <button
          className="btn"
          onClick={convert}
          disabled={loading || !file}
          style={{ marginTop: "1rem" }}
        >
          {loading ? "Convirtiendo..." : "Convertir"}
        </button>

        {error && <p className="error" style={{ marginTop: "1rem" }}>{error}</p>}

        {result && (
          <div style={{ marginTop: "1.5rem", padding: "1rem", background: "var(--bg)", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ margin: 0 }}>Resultado</h3>
              <button className="btn" onClick={handleDownload}>
                <FiDownload size={16} style={{ marginRight: "0.25rem" }} />
                Descargar
              </button>
            </div>
            
            {result.sheetNames && (
              <p className="muted" style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                Hojas disponibles: {result.sheetNames.join(", ")}
                {result.currentSheet && ` (Procesada: ${result.currentSheet})`}
              </p>
            )}
            
            {result.rowCount && (
              <p className="muted" style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>
                Filas procesadas: {result.rowCount}
              </p>
            )}

            {outputFormat === "csv" && result.csv && (
              <div
                style={{
                  padding: "1rem",
                  background: "var(--card)",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  maxHeight: "400px",
                  overflowY: "auto",
                  fontFamily: "monospace",
                  fontSize: "0.9rem",
                  whiteSpace: "pre-wrap",
                }}
              >
                {result.csv.substring(0, 5000)}
                {result.csv.length > 5000 && (
                  <span className="muted">... (truncado, descarga el archivo para ver el contenido completo)</span>
                )}
              </div>
            )}

            {outputFormat === "json" && result.data && (
              <div
                style={{
                  padding: "1rem",
                  background: "var(--card)",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  maxHeight: "400px",
                  overflowY: "auto",
                  fontFamily: "monospace",
                  fontSize: "0.9rem",
                }}
              >
                <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                  {JSON.stringify(result.data, null, 2).substring(0, 5000)}
                  {JSON.stringify(result.data, null, 2).length > 5000 && (
                    <span className="muted">... (truncado, descarga el archivo para ver el contenido completo)</span>
                  )}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

