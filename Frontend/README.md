# Frontend - Converters Hub

Interfaz web para Converters Hub, construida con React y Vite.

## Configuración

### Variables de entorno

Crea un archivo `.env` en la raíz del proyecto Frontend con la siguiente variable:

```env
VITE_API_URL=http://localhost:3001
```

**Nota**: Si el backend está corriendo en otro puerto o host, ajusta la URL según corresponda.

## Desarrollo

1. **Instala las dependencias**:
```bash
npm install
```

2. **Inicia el servidor de desarrollo**:
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173` (o el puerto que Vite asigne automáticamente si 5173 está ocupado).

## Solución de problemas

### Error: "Failed to fetch"

Este error indica que el frontend no puede conectarse al backend. Sigue estos pasos para solucionarlo:

1. **Verifica que el backend esté corriendo**:
   - El backend debe estar ejecutándose en el puerto configurado (por defecto 3001)
   - Para iniciarlo:
   ```bash
   cd ../Backend
   npm run dev
   ```

2. **Verifica la URL de conexión**:
   - Revisa que `VITE_API_URL` en el archivo `.env` apunte correctamente al backend
   - Debe coincidir con el puerto y host donde corre el backend

3. **Verifica la configuración CORS**:
   - El backend debe tener CORS habilitado para permitir peticiones desde el frontend
   - Verifica que `ALLOW_ORIGINS` en el `.env` del backend incluya el origen del frontend

4. **Verifica el firewall**:
   - Asegúrate de que el puerto del backend (3001 por defecto) no esté bloqueado por el firewall de Windows
