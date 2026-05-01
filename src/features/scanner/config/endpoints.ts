// ─────────────────────────────────────────────────────────────────────────────
// Endpoints del módulo Scanner
//
// Cambiar aquí cuando se conozcan las rutas reales de OCR/n8n. Cada entrada
// puede ser:
//   - Relativa al baseURL del httpClient (Axios)  → isAbsolute: false
//   - URL absoluta (ej. n8n directo en otro host) → isAbsolute: true
//
// La capa scannerService usa estas constantes; los componentes nunca las leen
// directamente.
// ─────────────────────────────────────────────────────────────────────────────

export interface EndpointConfig {
    url: string;
    isAbsolute: boolean;
    method: "POST" | "GET" | "PUT";
}

export const SCANNER_ENDPOINTS = {
    /**
     * OCR / transcripción del archivo capturado.
     * Recibe multipart/form-data con campo `archivo` y opcionalmente `codigo_acta`.
     * Por defecto apunta al backend Go (`/api/v1/scanner/transcribir`).
     *
     * Si más adelante hay un servicio de OCR real (Tesseract/Cloud Vision/n8n),
     * cambia `url` por la URL absoluta y pon `isAbsolute: true`.
     */
    ocrTranscribir: {
        url: "/scanner/transcribir",
        isAbsolute: false,
        method: "POST",
    } as EndpointConfig,

    /**
     * Webhook que persiste el acta transcrita en el backend.
     * Recibe JSON con codigoActa, p1..p4, votosValidos, observaciones, etc.
     *
     * Por defecto va al webhook público del backend
     * (POST http://localhost:8080/webhook/n8n/transcripcion).
     *
     * Para enviarlo directamente a n8n (ej. http://localhost:5678/webhook/...)
     * cambia `url` y `isAbsolute: true`.
     */
    webhookTranscripcion: {
        url:
            (import.meta.env.VITE_TRANSCRIPCION_WEBHOOK_URL as string | undefined) ??
            "http://localhost:8080/webhook/n8n/transcripcion",
        isAbsolute: true,
        method: "POST",
    } as EndpointConfig,

    /**
     * Trigger del workflow n8n (simulación masiva). Opcional.
     * Por defecto al endpoint protegido del backend (`/api/v1/transcripcion/simular`).
     */
    triggerSimulacion: {
        url: "/transcripcion/simular",
        isAbsolute: false,
        method: "POST",
    } as EndpointConfig,
};
