import { useState } from "react";
import { API_URL } from "../config";
import JobStatus from "../components/JobStatus";
import FileDropzone from "../components/FileDropzone";
import { useSEO } from "../hooks/useSEO";
import { FiUpload, FiX, FiMusic } from "react-icons/fi";
import ProgressBar from "../components/ProgressBar";

const SUPPORTED_FORMATS = [
  { value: "mp3", label: "MP3", description: "Audio comprimido ampliamente compatible" },
  { value: "wav", label: "WAV", description: "Audio sin compresión, alta calidad" },
  { value: "ogg", label: "OGG", description: "Formato libre y eficiente" },
  { value: "m4a", label: "M4A", description: "Audio AAC, usado por Apple" },
  { value: "aac", label: "AAC", description: "Audio avanzado comprimido" },
  { value: "flac", label: "FLAC", description: "Audio sin pérdida" },
  { value: "wma", label: "WMA", description: "Windows Media Audio" },
  { value: "opus", label: "Opus", description: "Formato moderno y eficiente" },
];

export default function AudioConvert() {
  useSEO({
    title: "Convertidor de formatos de audio online | Converters Hub",
    description: "Convierte audio entre formatos: MP3, WAV, OGG, M4A, AAC, FLAC, WMA, Opus. Conversión rápida y sin pérdida de calidad.",
  });

  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [outputFormat, setOutputFormat] = useState("mp3");
  const [quality, setQuality] = useState(192);
  const [jobId, setJobId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFile = async (selectedFile) => {
    if (!selectedFile) {
      setFile(null);
      setUploadedFileUrl("");
      setJobId("");
      setError("");
      return;
    }

    setFile(selectedFile);
    setJobId("");
    setUploadedFileUrl("");
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
    setJobId("");
    setError("");
  };

  const submit = async () => {
    if (!uploadedFileUrl) {
      setError("Por favor sube el archivo primero");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/jobs/audio-convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          fileUrl: uploadedFileUrl, 
          outputFormat: outputFormat,
          quality: quality,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al iniciar la conversión de audio");
      setJobId(data.jobId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedFormat = SUPPORTED_FORMATS.find(f => f.value === outputFormat);

  return (
    <div>
      <div className="hero">
        <h1>Convertidor de Formatos de Audio</h1>
        <p>Convierte archivos de audio entre diferentes formatos: MP3, WAV, OGG, M4A, AAC, FLAC y más. El procesamiento se realiza en segundo plano.</p>
      </div>
      <div className="card">
        <FileDropzone
          onFile={handleFile}
          accept=".mp3,.wav,.m4a,.ogg,.aac,.flac,.wma,.opus,.mp4"
          maxSize={100 * 1024 * 1024}
          label="Arrastra un archivo de audio o haz clic para cargar"
        />

        {file && (
          <div style={{ marginTop: "1rem", padding: "0.75rem", background: "var(--bg)", borderRadius: "8px" }}>
            <div className="flex" style={{ alignItems: "center", justifyContent: "space-between" }}>
              <div className="flex" style={{ alignItems: "center", gap: "0.5rem" }}>
                <FiMusic size={16} />
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

        {uploadedFileUrl && (
          <>
            <div className="field" style={{ marginTop: "1rem" }}>
              <label>Formato de salida</label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
              >
                {SUPPORTED_FORMATS.map((format) => (
                  <option key={format.value} value={format.value}>
                    {format.label} - {format.description}
                  </option>
                ))}
              </select>
              {selectedFormat && (
                <p className="muted" style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>
                  {selectedFormat.description}
                </p>
              )}
            </div>

            {(outputFormat === "mp3" || outputFormat === "ogg" || outputFormat === "m4a" || outputFormat === "aac" || outputFormat === "wma" || outputFormat === "opus") && (
              <div className="field" style={{ marginTop: "1rem" }}>
                <label>Calidad (kbps): {quality}</label>
                <input
                  type="range"
                  min="64"
                  max="320"
                  step="32"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--muted)", marginTop: "0.25rem" }}>
                  <span>64 (baja)</span>
                  <span>192 (recomendado)</span>
                  <span>320 (alta)</span>
                </div>
              </div>
            )}
          </>
        )}

        <button
          className="btn"
          onClick={submit}
          disabled={loading || !uploadedFileUrl}
          style={{ marginTop: "1rem" }}
        >
          {loading ? "Iniciando conversión..." : "Convertir audio"}
        </button>

        {error && <p className="error" style={{ marginTop: "1rem" }}>{error}</p>}
      </div>
      <JobStatus queue="audio" jobId={jobId} />
    </div>
  );
}

