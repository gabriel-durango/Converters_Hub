import ToolCard from "../components/ToolCard";
import { useSEO } from "../hooks/useSEO";
import {
  FiFileText,
  FiType,
  FiMaximize,
  FiFile,
  FiFileMinus,
  FiMusic,
  FiLock,
  FiLink,
  FiHash,
  FiCode,
  FiLayers,
  FiClock,
  FiDroplet,
  FiImage,
  FiTable,
} from "react-icons/fi";

const tools = [
  {
    title: "CSV ↔ JSON ↔ YAML",
    description: "Convierte entre formatos con delimitador personalizable y validación automática.",
    href: "/tools/csv-json",
    icon: FiFileText,
  },
  {
    title: "Normalizador de texto",
    description: "Limpia y normaliza listas: elimina espacios, duplicados y ajusta mayúsculas/minúsculas.",
    href: "/tools/normalize",
    icon: FiType,
  },
  {
    title: "QR y códigos de barras",
    description: "Genera códigos QR y de barras listos para descargar o compartir.",
    href: "/tools/qr",
    icon: FiMaximize,
  },
  {
    title: "PDF a Imágenes",
    description: "Convierte PDF a imágenes optimizadas. Procesamiento en segundo plano.",
    href: "/tools/pdf",
    icon: FiFile,
  },
  {
    title: "DOCX a PDF",
    description: "Convierte documentos DOCX a PDF sin bloquear tu navegador.",
    href: "/tools/docx",
    icon: FiFileMinus,
  },
  {
    title: "Audio a Texto",
    description: "Transcribe archivos de audio a texto. Soporta webhooks para notificaciones.",
    href: "/tools/audio",
    icon: FiMusic,
  },
  {
    title: "Convertidor de Audio",
    description: "Convierte entre formatos: MP3, WAV, OGG, M4A, AAC, FLAC, WMA, Opus.",
    href: "/tools/audio-convert",
    icon: FiMusic,
  },
  {
    title: "XLSX a CSV/JSON",
    description: "Convierte archivos Excel (XLSX) a CSV o JSON de forma rápida.",
    href: "/tools/xlsx",
    icon: FiTable,
  },
  {
    title: "Convertidor de Formatos de Imagen",
    description: "Convierte imágenes entre PNG, JPEG, WEBP, AVIF, GIF, TIFF, BMP.",
    href: "/tools/image-format",
    icon: FiImage,
  },
  {
    title: "Base64 Encode/Decode",
    description: "Codifica y decodifica texto a Base64 de forma rápida y segura.",
    href: "/tools/base64",
    icon: FiLock,
  },
  {
    title: "URL Encode/Decode",
    description: "Codifica y decodifica URLs para trabajar con parámetros y caracteres especiales.",
    href: "/tools/url-encode",
    icon: FiLink,
  },
  {
    title: "Generador de Hash",
    description: "Genera hashes MD5, SHA1, SHA256 y SHA512 de texto.",
    href: "/tools/hash",
    icon: FiHash,
  },
  {
    title: "JSON Formatter",
    description: "Formatea, valida y minifica JSON de forma rápida y segura.",
    href: "/tools/json-formatter",
    icon: FiCode,
  },
  {
    title: "JSON a XML",
    description: "Convierte JSON a XML de forma rápida y sencilla.",
    href: "/tools/xml-json",
    icon: FiLayers,
  },
  {
    title: "Timestamp Converter",
    description: "Convierte timestamps Unix a fechas y viceversa.",
    href: "/tools/timestamp",
    icon: FiClock,
  },
  {
    title: "Color Converter",
    description: "Convierte colores entre HEX, RGB y HSL para diseñadores.",
    href: "/tools/color",
    icon: FiDroplet,
  },
];

export default function Home() {
  useSEO({
    title: "Conversores online: CSV, JSON, PDF, Audio | Converters Hub",
    description:
      "Suite rápida de conversión online: CSV↔JSON↔YAML, normalizador, QR/barcodes, PDF y audio en colas. UX limpia y anuncios solo laterales.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Converters Hub",
      url: typeof window !== "undefined" ? window.location.origin : "",
      potentialAction: {
        "@type": "SearchAction",
        target: typeof window !== "undefined" ? `${window.location.origin}/tools/{search_term_string}` : "",
        "query-input": "required name=search_term_string",
      },
    },
  });

  return (
    <div>
      <section className="hero">
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          gap: "1.5rem", 
          marginBottom: "2rem",
          flexWrap: "wrap"
        }}>
          <img 
            src="/ConverterHub.png" 
            alt="Converters Hub Logo" 
            style={{ 
              height: "80px", 
              width: "auto", 
              objectFit: "contain",
              flexShrink: 0
            }}
            onError={(e) => {
              // Fallback si la imagen no carga
              e.target.style.display = 'none';
            }}
          />
          <h1 style={{ margin: 0, textAlign: "center", flex: "1 1 300px" }}>
            Conversores online rápidos y sin complicaciones
          </h1>
        </div>
        <p>
          Convierte CSV a JSON, normaliza texto, genera códigos QR, procesa PDFs y audio.
          Interfaz limpia y resultados listos para compartir.
        </p>
      </section>
      <div className="grid">
        {tools.map((tool) => (
          <ToolCard key={tool.title} {...tool} />
        ))}
      </div>
    </div>
  );
}
