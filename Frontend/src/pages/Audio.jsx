import { useState, useEffect } from "react";
import { API_URL } from "../config";
import JobStatus from "../components/JobStatus";
import FileDropzone from "../components/FileDropzone";
import { useSEO } from "../hooks/useSEO";
import { FiUpload, FiX } from "react-icons/fi";
import ProgressBar from "../components/ProgressBar";

export default function Audio() {
  useSEO({
    title: "Audio a texto (batch) | Converters Hub",
    description: "Encola audios para transcribir con webhook opcional y seguimiento de progreso.",
  });

  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
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
          // Ocultar el mensaje de éxito después de 3 segundos
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
      const res = await fetch(`${API_URL}/jobs/audio-to-text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl: uploadedFileUrl, webhookUrl: webhookUrl || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al iniciar la transcripción del audio");
      setJobId(data.jobId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="hero">
        <h1>Audio a Texto</h1>
        <p>Transcribe archivos de audio a texto. El procesamiento se realiza en segundo plano. Puedes recibir el resultado por webhook o consultarlo aquí.</p>
      </div>
      <div className="card">
        <FileDropzone
          onFile={handleFile}
          accept=".mp3,.wav,.m4a,.ogg"
          maxSize={100 * 1024 * 1024}
          label="Arrastra un archivo de audio o haz clic para cargar"
        />

        {file && (
          <div style={{ marginTop: "1rem", padding: "0.75rem", background: "var(--bg)", borderRadius: "8px" }}>
            <div className="flex" style={{ alignItems: "center", justifyContent: "space-between" }}>
              <div className="flex" style={{ alignItems: "center", gap: "0.5rem" }}>
                <FiUpload size={16} />
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
            gap: "0.5rem",
            animation: "fadeOut 0.3s ease-out 2.7s forwards"
          }}>
            <span style={{ fontSize: "1rem" }}>✓</span>
            <span style={{ fontSize: "0.9rem", color: "var(--success)", fontWeight: 500 }}>
              Archivo subido correctamente
            </span>
          </div>
        )}

        <div className="field" style={{ marginTop: "1rem" }}>
          <label>Webhook (opcional)</label>
          <input
            placeholder="https://miapp.com/webhook"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
          />
        </div>

        <button
          className="btn"
          onClick={submit}
          disabled={loading || !uploadedFileUrl}
          style={{ marginTop: "1rem" }}
        >
          {loading ? "Iniciando transcripción..." : "Transcribir audio"}
        </button>

        {error && <p className="error" style={{ marginTop: "1rem" }}>{error}</p>}
      </div>
      <JobStatus queue="audio" jobId={jobId} />
    </div>
  );
}
