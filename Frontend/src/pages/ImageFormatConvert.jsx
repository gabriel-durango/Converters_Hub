import { useState } from "react";
import { API_URL } from "../config";
import JobStatus from "../components/JobStatus";
import FileDropzone from "../components/FileDropzone";
import { useSEO } from "../hooks/useSEO";
import { FiImage, FiX } from "react-icons/fi";
import ProgressBar from "../components/ProgressBar";

const SUPPORTED_FORMATS = [
  { value: "png", label: "PNG", description: "Sin pérdida, ideal para gráficos" },
  { value: "jpeg", label: "JPEG", description: "Comprimido, ideal para fotos" },
  { value: "webp", label: "WEBP", description: "Moderno, alta compresión" },
  { value: "avif", label: "AVIF", description: "Ultra moderno, mejor compresión" },
  { value: "gif", label: "GIF", description: "Animaciones y gráficos simples" },
  { value: "tiff", label: "TIFF", description: "Alta calidad, sin pérdida" },
  { value: "bmp", label: "BMP", description: "Sin compresión, alta calidad" },
];

export default function ImageFormatConvert() {
  useSEO({
    title: "Convertidor de formatos de imagen online | Converters Hub",
    description: "Convierte imágenes entre formatos: PNG, JPEG, WEBP, AVIF, GIF, TIFF, BMP. Conversión rápida y sin pérdida de calidad.",
  });

  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [outputFormat, setOutputFormat] = useState("png");
  const [quality, setQuality] = useState(90);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
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

  const convert = async () => {
    if (!uploadedFileUrl) {
      setError("Por favor sube el archivo primero");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const body = {
        fileUrl: uploadedFileUrl,
        outputFormat: outputFormat,
        quality: quality,
      };

      if (width) body.width = parseInt(width);
      if (height) body.height = parseInt(height);

      const res = await fetch(`${API_URL}/jobs/image-convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al iniciar la conversión");
      setJobId(data.jobId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedFormat = SUPPORTED_FORMATS.find(f => f.value === outputFormat);
  const supportsQuality = ["jpeg", "webp", "avif", "png"].includes(outputFormat);

  return (
    <div>
      <div className="hero">
        <h1>Convertidor de Formatos de Imagen</h1>
        <p>Convierte imágenes entre diferentes formatos: PNG, JPEG, WEBP, AVIF, GIF, TIFF, BMP.</p>
      </div>
      <div className="card">
        <FileDropzone
          onFile={handleFile}
          accept=".png,.jpg,.jpeg,.webp,.avif,.gif,.tiff,.bmp"
          maxSize={50 * 1024 * 1024}
          label="Arrastra una imagen o haz clic para cargar"
        />

        {file && (
          <div style={{ marginTop: "1rem", padding: "0.75rem", background: "var(--bg)", borderRadius: "8px" }}>
            <div className="flex" style={{ alignItems: "center", justifyContent: "space-between" }}>
              <div className="flex" style={{ alignItems: "center", gap: "0.5rem" }}>
                <FiImage size={16} />
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

            {supportsQuality && (
              <div className="field" style={{ marginTop: "1rem" }}>
                <label>Calidad: {quality}%</label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--muted)", marginTop: "0.25rem" }}>
                  <span>Baja (1%)</span>
                  <span>Alta (100%)</span>
                </div>
              </div>
            )}

            <div className="field" style={{ marginTop: "1rem" }}>
              <label>Redimensionar (opcional)</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="number"
                  placeholder="Ancho"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  style={{ flex: 1 }}
                />
                <input
                  type="number"
                  placeholder="Alto"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  style={{ flex: 1 }}
                />
              </div>
              <p className="muted" style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>
                Deja vacío para mantener el tamaño original
              </p>
            </div>
          </>
        )}

        <button
          className="btn"
          onClick={convert}
          disabled={loading || !uploadedFileUrl}
          style={{ marginTop: "1rem" }}
        >
          {loading ? "Iniciando conversión..." : "Convertir imagen"}
        </button>

        {error && <p className="error" style={{ marginTop: "1rem" }}>{error}</p>}
      </div>
      <JobStatus queue="image" jobId={jobId} />
    </div>
  );
}

