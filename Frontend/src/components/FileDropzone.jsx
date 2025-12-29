import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload, FiFile, FiX } from "react-icons/fi";
import ProgressBar from "./ProgressBar";

export default function FileDropzone({ onFile, accept, maxSize = 10 * 1024 * 1024, label = "Arrastra un archivo o haz clic para cargar" }) {
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      setError("");
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors.some((e) => e.code === "file-too-large")) {
          setError(`El archivo es demasiado grande. Máximo: ${(maxSize / 1024 / 1024).toFixed(1)}MB`);
        } else if (rejection.errors.some((e) => e.code === "file-invalid-type")) {
          setError("Tipo de archivo no permitido");
        } else {
          setError("Error al cargar el archivo");
        }
        return;
      }

      const [selectedFile] = acceptedFiles;
      if (!selectedFile) return;

      setFile(selectedFile);
      setProgress(0);

      // Simular progreso de lectura
      const reader = new FileReader();
      reader.onprogress = (evt) => {
        if (evt.lengthComputable) {
          const pct = Math.round((evt.loaded / evt.total) * 100);
          setProgress(pct);
        }
      };

      reader.onload = () => {
        setProgress(100);
        onFile(selectedFile);
        setTimeout(() => setProgress(0), 500);
      };

      reader.onerror = () => {
        setError("Error al leer el archivo");
        setProgress(0);
      };

      reader.readAsArrayBuffer(selectedFile);
    },
    [onFile, maxSize]
  );

  // Mapeo de extensiones a MIME types
  const getMimeTypes = (acceptString) => {
    if (!acceptString) return undefined;
    
    const extensions = acceptString.split(",").map((ext) => ext.trim().toLowerCase());
    const mimeMap = {
      ".pdf": "application/pdf",
      ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".doc": "application/msword",
      ".mp3": "audio/mpeg",
      ".wav": "audio/wav",
      ".ogg": "audio/ogg",
      ".mp4": "video/mp4",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".csv": "text/csv",
      ".json": "application/json",
      ".txt": "text/plain",
    };
    
    const acceptObj = {};
    extensions.forEach((ext) => {
      const mimeType = mimeMap[ext];
      if (mimeType) {
        if (!acceptObj[mimeType]) {
          acceptObj[mimeType] = [];
        }
        acceptObj[mimeType].push(ext);
      } else {
        // Si no hay MIME type mapeado, usar la extensión directamente
        if (!acceptObj[ext]) {
          acceptObj[ext] = [];
        }
        acceptObj[ext].push(ext);
      }
    });
    
    return Object.keys(acceptObj).length > 0 ? acceptObj : undefined;
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: getMimeTypes(accept),
    maxSize,
    multiple: false,
  });

  const handleRemove = () => {
    setFile(null);
    setError("");
    onFile(null);
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "active" : ""}`}
        aria-label="Zona de arrastre para cargar archivo"
      >
        <input {...getInputProps()} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
          <FiUpload size={32} style={{ color: "var(--muted)" }} />
          <span>{isDragActive ? "Suelta el archivo aquí" : label}</span>
          {file && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
              <FiFile size={16} />
              <span style={{ fontSize: "0.9rem" }}>{file.name}</span>
              <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          )}
        </div>
      </div>
      {progress > 0 && <ProgressBar value={progress} label="Cargando archivo" />}
      {error && <p className="error" style={{ marginTop: "0.5rem" }}>{error}</p>}
      {file && (
        <button className="btn secondary" onClick={handleRemove} style={{ marginTop: "0.5rem" }}>
          <FiX size={16} />
          Eliminar archivo
        </button>
      )}
    </div>
  );
}

