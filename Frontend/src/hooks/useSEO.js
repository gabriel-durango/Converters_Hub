import { useEffect } from "react";

export function useSEO({ title, description, jsonLd }) {
  useEffect(() => {
    if (title) document.title = title;

    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.content = description;
    }

    let script;
    if (jsonLd) {
      const existing = document.getElementById("ld-json");
      script = existing || document.createElement("script");
      script.type = "application/ld+json";
      script.id = "ld-json";
      script.textContent = JSON.stringify(jsonLd);
      if (!existing) document.head.appendChild(script);
    }

    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [title, description, jsonLd]);
}

