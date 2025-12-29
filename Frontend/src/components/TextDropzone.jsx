import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import ProgressBar from "./ProgressBar";

export default function TextDropzone({ onText, accept = ".txt,.csv,.json,.yaml,.yml" }) {
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const [file] = acceptedFiles;
      if (!file) return;
      const reader = new FileReader();
      reader.onprogress = (evt) => {
        if (!evt.lengthComputable) return;
        const pct = Math.round((evt.loaded / evt.total) * 100);
        setProgress(pct);
      };
      reader.onload = () => {
        setProgress(100);
        onText(String(reader.result || ""));
        setTimeout(() => setProgress(0), 400);
      };
      reader.readAsText(file);
    },
    [onText]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/plain": accept.split(",") },
    multiple: false,
  });

  return (
    <>
      <div
        {...getRootProps()}
        className="dropzone"
        aria-label="Zona de arrastre para cargar archivo de texto"
      >
        <input {...getInputProps()} />
        {isDragActive ? "Suelta el archivo aquí" : "Arrastra un archivo o haz clic para cargar"}
      </div>
      {progress > 0 && <ProgressBar value={progress} label="Leyendo archivo" />}
    </>
  );
}

