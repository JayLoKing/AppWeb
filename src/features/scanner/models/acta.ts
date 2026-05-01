// Payload normalizado de un acta lista para enviar al webhook de transcripción.
// Coincide 1:1 con lo que espera POST /webhook/n8n/transcripcion en el backend Go.

export interface ActaPayload {
    codigoActa: number;
    p1: number;
    p2: number;
    p3: number;
    p4: number;
    votosValidos: number;
    votosNulos: number;
    votosBlanco: number;
    papeletasAnfora: number;
    papeletasNoUsadas: number;
    observaciones: string;
    aperturaHora: number;
    aperturaMinutos: number;
    cierreHora: number;
    cierreMinutos: number;
}

export const emptyActa = (): ActaPayload => ({
    codigoActa: 0,
    p1: 0,
    p2: 0,
    p3: 0,
    p4: 0,
    votosValidos: 0,
    votosNulos: 0,
    votosBlanco: 0,
    papeletasAnfora: 0,
    papeletasNoUsadas: 0,
    observaciones: "",
    aperturaHora: 8,
    aperturaMinutos: 0,
    cierreHora: 16,
    cierreMinutos: 0,
});

// Respuesta del endpoint OCR (/scanner/transcribir).
export interface OcrResponse {
    success: boolean;
    message: string;
    estado: "transcrita" | "observada";
    acta_id?: number;
    data: {
        codigo_acta: number;
        p1: number;
        p2: number;
        p3: number;
        p4: number;
        votos_validos: number;
        votos_nulos: number;
        votos_blancos: number;
        papeletas_anfora: number;
        observaciones: string;
        acta_actualizada: boolean;
    };
}

// Respuesta del webhook de transcripción.
export interface WebhookResponse {
    ok: boolean;
    id: number;
    estado: "transcrita" | "observada";
}

// Mapea la respuesta de OCR (snake_case parcial) al ActaPayload.
export const ocrToActa = (resp: OcrResponse): ActaPayload => {
    const d = resp.data;
    return {
        codigoActa: Number(d.codigo_acta) || 0,
        p1: d.p1 ?? 0,
        p2: d.p2 ?? 0,
        p3: d.p3 ?? 0,
        p4: d.p4 ?? 0,
        votosValidos: d.votos_validos ?? 0,
        votosNulos: d.votos_nulos ?? 0,
        votosBlanco: d.votos_blancos ?? 0,
        papeletasAnfora: d.papeletas_anfora ?? 0,
        papeletasNoUsadas: 0,
        observaciones: d.observaciones ?? "",
        aperturaHora: 8,
        aperturaMinutos: 0,
        cierreHora: 16,
        cierreMinutos: 0,
    };
};
