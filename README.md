# Converters Hub

Aplicación web de herramientas de conversión y formateo de datos. Ofrece múltiples utilidades para convertir entre diferentes formatos de archivos y realizar transformaciones de datos de manera rápida y sencilla.

## Descripción

Convertido-Comparador es una plataforma que proporciona herramientas de conversión y procesamiento de archivos online. El proyecto está dividido en dos partes: un frontend desarrollado en React y un backend en Node.js que maneja las operaciones de conversión.

## Características

### Conversión de Formatos de Datos
- CSV a JSON y JSON a CSV con delimitador personalizable
- XML a JSON y JSON a XML
- XLSX a CSV/JSON

### Procesamiento de Archivos
- PDF: conversión de documentos
- DOCX: conversión de documentos Word
- Audio: conversión entre formatos MP3, WAV, OGG, M4A, AAC, FLAC, OPUS
- Imágenes: conversión entre PNG, JPEG, WEBP, AVIF, GIF, TIFF, BMP

### Herramientas de Codificación
- Base64: codificación y decodificación
- URL Encode/Decode: codificación y decodificación de URLs
- Hash: generación de hashes MD5, SHA-1, SHA-256, SHA-512

### Utilidades Adicionales
- JSON Formatter: formateo, validación y minificación de JSON
- Generador de códigos QR
- Normalizador de texto
- Conversor de Timestamp
- Conversor de colores (HEX, RGB, HSL)

## Estructura del Proyecto

```
Convertido-Comparador/
├── Frontend/          # Aplicación React con Vite
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/         # Páginas de herramientas
│   │   ├── layouts/       # Layouts de la aplicación
│   │   ├── hooks/         # Custom hooks
│   │   ├── theme/         # Gestión de temas
│   │   └── utils/         # Utilidades
│   └── package.json
└── Backend/           # API REST con Node.js
    └── [archivos del backend]
```

## Tecnologías

### Frontend
- React 19.2
- React Router DOM 7.1
- Vite 7.2
- React Dropzone 14.3
- React Icons 5.3

### Backend
- Node.js
- Express (API REST)

## Instalación

### Prerrequisitos
- Node.js (versión recomendada: 18 o superior)
- npm o yarn

### Frontend

1. Navega a la carpeta del frontend:
```bash
cd Frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` con la configuración:
```env
VITE_API_URL=http://localhost:3001
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

### Backend

1. Navega a la carpeta del backend:
```bash
cd Backend
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno (crear archivo `.env`)

4. Inicia el servidor:
```bash
npm run dev
```

El backend estará disponible en `http://localhost:3001`

## Scripts Disponibles

### Frontend
- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la versión de producción
- `npm run lint` - Ejecuta el linter

## Uso

1. Asegúrate de que el backend esté corriendo
2. Inicia el frontend
3. Accede a `http://localhost:5173` en tu navegador
4. Selecciona la herramienta que deseas utilizar desde la página principal
5. Carga o ingresa los datos que deseas convertir
6. Descarga o copia el resultado

## Características Técnicas

- Procesamiento asíncrono de archivos grandes mediante jobs en segundo plano
- Soporte para arrastrar y soltar archivos
- Validación de formatos de entrada
- Manejo de errores robusto
- Interfaz responsive
- Soporte para tema claro/oscuro
- SEO optimizado con metadatos dinámicos

## Solución de Problemas

### Error: "Failed to fetch"
Este error indica que el frontend no puede conectarse al backend:

1. Verifica que el backend esté corriendo en el puerto configurado
2. Revisa que `VITE_API_URL` en el `.env` apunte correctamente al backend
3. Verifica la configuración CORS en el backend
4. Comprueba que no haya firewalls bloqueando la conexión

## Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría realizar.

## Licencia

Este proyecto no especifica una licencia actualmente.

## Autor

gabriel-durango

## Rama Principal

`develop`
