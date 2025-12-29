import { API_URL } from "../config";

/**
 * Maneja errores de fetch y retorna mensajes más claros
 */
export function handleFetchError(err) {
  if (err.message === "Failed to fetch" || err.name === "TypeError") {
    return `No se pudo conectar al servidor. Verifica que el backend esté corriendo en ${API_URL}`;
  }
  return err.message || "Error desconocido";
}

/**
 * Wrapper para fetch con mejor manejo de errores
 */
export async function apiFetch(url, options = {}) {
  try {
    const res = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `Error ${res.status}: ${res.statusText}`);
    }

    return data;
  } catch (err) {
    if (err.message && !err.message.startsWith("Error")) {
      throw new Error(handleFetchError(err));
    }
    throw err;
  }
}

