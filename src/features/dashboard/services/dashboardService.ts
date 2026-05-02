import { httpClient } from "../../../config/axios";

// ─── Tipos del backend (Go) ────────────────────────────────────────────────

export interface ResumenComparacion {
    fecha_comparacion: string;
    total_actas_rrv: number;
    total_actas_oficial: number;
    total_actas_comparadas: number;
    actas_consistentes: number;
    actas_inconsistentes: number;
    actas_solo_rrv: number;
    actas_solo_oficial: number;
    confiabilidad_rrv: number;
    diferencia_total_votos: number;
}

export interface ChartDataset<T = number> {
    label: string;
    data: T[];
    backgroundColor?: string | string[];
}
export interface ChartPayload {
    labels: string[];
    datasets: ChartDataset[];
    raw?: Record<string, number>;
}

export interface ActaComparada {
    acta_id: string;
    departamento: string;
    municipio: string;
    recinto: string;
    mesa: string;
    estado_comparacion: "CONSISTENTE" | "INCONSISTENTE" | "SOLO_RRV" | "SOLO_OFICIAL";
    diferencias?: {
        diferencia_total_votos: number;
    };
    inconsistencias?: { severidad?: "ALTA" | "MEDIA" | "BAJA" }[];
}

export interface InconsistenciasResponse {
    resumen: ResumenComparacion;
    inconsistencias: ActaComparada[];
    total: number;
}

export interface GeoItem {
    nombre: string;
    total_actas: number;
    consistentes: number;
    inconsistentes: number;
    solo_rrv: number;
    solo_oficial: number;
    diferencia_total_votos: number;
}
export interface GeograficoResponse {
    group_by: string;
    total: number;
    items: GeoItem[];
}

export interface TecnicoResponse {
    timestamp: string;
    latencia_ms: number | null;
    throughput_actas_min: number | null;
    disponibilidad: string;
    seguridad: { jwt_required: boolean; https_requerido: boolean };
    fuentes: {
        mongodb: { estado: string; total_actas: number; coleccion: string };
        postgresql: { estado: string; total_actas: number; tabla: string };
    };
    modulo_comparacion: { cqrs_mode: string; modifica_datos: boolean; version: string };
}

export interface ParticipacionResponse {
    available: boolean;
    message?: string;
    labels: string[];
    datasets: ChartDataset<number>[];
    raw?: { total_habilitados: number; total_votos: number };
}

// ─── Llamadas reales (devuelven el payload tal cual viene del backend) ────

export const dashboardService = {
    getKPIs: (): Promise<ResumenComparacion> =>
        httpClient.get<ResumenComparacion>("/dashboard/kpis").then((r) => r.data),

    getRRVvsOficial: (): Promise<ChartPayload> =>
        httpClient.get<ChartPayload>("/dashboard/rrv-vs-oficial").then((r) => r.data),

    getVotosCandidato: (): Promise<ChartPayload> =>
        httpClient.get<ChartPayload>("/dashboard/votos-candidato").then((r) => r.data),

    getParticipacion: (): Promise<ParticipacionResponse> =>
        httpClient.get<ParticipacionResponse>("/dashboard/participacion").then((r) => r.data),

    getGeografico: (groupBy: "departamento" | "municipio" | "recinto" = "departamento"): Promise<GeograficoResponse> =>
        httpClient
            .get<GeograficoResponse>("/dashboard/geografico", { params: { group_by: groupBy } })
            .then((r) => r.data),

    getTecnico: (): Promise<TecnicoResponse> =>
        httpClient.get<TecnicoResponse>("/dashboard/tecnico").then((r) => r.data),

    getInconsistencias: (): Promise<InconsistenciasResponse> =>
        httpClient.get<InconsistenciasResponse>("/dashboard/inconsistencias").then((r) => r.data),
};
