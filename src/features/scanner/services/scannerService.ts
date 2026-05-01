import axios from "axios";
import { httpClient } from "../../../config/axios";
import { useAuthStore } from "../../auth/hooks/useAuthStore";
import { SCANNER_ENDPOINTS, type EndpointConfig } from "../config/endpoints";
import type { ActaPayload, OcrResponse, WebhookResponse } from "../models/acta";

// Cliente para URLs absolutas (n8n, webhooks externos, etc.).
// Inyecta JWT solo si el endpoint vive bajo el mismo dominio del backend.
const absoluteRequest = async <T>(
    cfg: EndpointConfig,
    body: FormData | Record<string, unknown>,
    extraHeaders?: Record<string, string>,
): Promise<T> => {
    const isMultipart = body instanceof FormData;
    const headers: Record<string, string> = {
        ...(isMultipart ? {} : { "Content-Type": "application/json" }),
        ...(extraHeaders ?? {}),
    };

    const { jwt } = useAuthStore.getState();
    if (jwt) headers["Authorization"] = `Bearer ${jwt}`;

    const { data } = await axios.request<T>({
        method: cfg.method,
        url: cfg.url,
        data: body,
        headers,
    });
    return data;
};

const relativeRequest = async <T>(
    cfg: EndpointConfig,
    body: FormData | Record<string, unknown>,
): Promise<T> => {
    const isMultipart = body instanceof FormData;
    const { data } = await httpClient.request<T>({
        method: cfg.method,
        url: cfg.url,
        data: body,
        headers: isMultipart ? { "Content-Type": "multipart/form-data" } : undefined,
    });
    return data;
};

const send = async <T>(cfg: EndpointConfig, body: FormData | Record<string, unknown>): Promise<T> => {
    return cfg.isAbsolute ? absoluteRequest<T>(cfg, body) : relativeRequest<T>(cfg, body);
};

// ─── API pública del módulo ────────────────────────────────────────────────

export const scannerService = {
    /**
     * Sube un archivo (PDF/JPG/PNG) al endpoint OCR y devuelve los datos transcritos.
     * En el flujo actual el backend Go simula OCR usando Transcripciones.csv,
     * pero la firma multipart es la misma que usaría un OCR real.
     */
    async transcribirArchivo(file: File, codigoActa?: number): Promise<OcrResponse> {
        const fd = new FormData();
        fd.append("archivo", file);
        if (codigoActa) fd.append("codigo_acta", String(codigoActa));
        return send<OcrResponse>(SCANNER_ENDPOINTS.ocrTranscribir, fd);
    },

    /**
     * Envía el acta transcrita (manual o post-OCR) al webhook que persiste en BD.
     */
    async enviarTranscripcion(payload: ActaPayload): Promise<WebhookResponse> {
        return send<WebhookResponse>(SCANNER_ENDPOINTS.webhookTranscripcion, payload as unknown as Record<string, unknown>);
    },

    /**
     * Dispara la simulación masiva del workflow n8n (opcional).
     */
    async dispararSimulacion(fallback = false): Promise<{ success: boolean; message: string }> {
        const cfg: EndpointConfig = {
            ...SCANNER_ENDPOINTS.triggerSimulacion,
            url: SCANNER_ENDPOINTS.triggerSimulacion.url + (fallback ? "?fallback=true" : ""),
        };
        return send(cfg, {});
    },
};
