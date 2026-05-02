import { httpClient } from "../../../config/axios";

export type ActaEstado = "impresa" | "transcrita" | "observada";

export interface Acta {
    id: number;
    codigoActa: string;
    codigoRecinto: string;
    nroMesa: number | string;
    estado: ActaEstado;
    p1: number;
    p2: number;
    p3: number;
    p4: number;
    votosValidos: number;
    votosNulos: number;
    votosBlanco: number;
    observaciones?: string;
}

export interface SimulacionResponse {
    success: boolean;
    estado?: "COMPLETADO" | "EN_PROGRESO" | string;
    source?: string;
    actualizadas?: number;
    observadas?: number;
    message?: string;
    hint?: string;
}

export const actasService = {
    list: (): Promise<Acta[]> =>
        httpClient.get<Acta[]>("/actas").then((r) => r.data ?? []),

    simular: (fallback = false): Promise<SimulacionResponse> => {
        const qs = fallback ? "?fallback=true" : "";
        return httpClient
            .post<SimulacionResponse>(`/transcripcion/simular${qs}`, {})
            .then((r) => r.data);
    },
};
