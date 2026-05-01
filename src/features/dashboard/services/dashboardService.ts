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

interface ChartDataset<T = number> {
    label: string;
    data: T[];
    backgroundColor?: string | string[];
}
interface ChartPayload {
    labels: string[];
    datasets: ChartDataset[];
    raw?: Record<string, number>;
}

interface ActaComparada {
    acta_id: string;
    departamento: string;
    municipio: string;
    recinto: string;
    mesa: string;
    estado_comparacion: "CONSISTENTE" | "INCONSISTENTE" | "SOLO_RRV" | "SOLO_OFICIAL";
    diferencias?: {
        diferencia_total_votos: number;
    };
}

interface InconsistenciasResponse {
    resumen: ResumenComparacion;
    inconsistencias: ActaComparada[];
    total: number;
}

interface GeoItem {
    nombre: string;
    total_actas: number;
    consistentes: number;
    inconsistentes: number;
    solo_rrv: number;
    solo_oficial: number;
    diferencia_total_votos: number;
}
interface GeograficoResponse {
    group_by: string;
    total: number;
    items: GeoItem[];
}

interface TecnicoResponse {
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

interface ParticipacionResponse {
    available: boolean;
    labels: string[];
    datasets: ChartDataset<number>[];
    raw?: { total_habilitados: number; total_votos: number };
}

// ─── Tipos consumidos por los componentes ──────────────────────────────────

export interface KpisVM {
    totalRrv: number;
    totalOficial: number;
    diferencia: number;
    actasRecibidas: number;
    actasProcesadas: number;
    actasPendientes: number;
    actasInconsistentes: number;
    confiabilidad: number;
    participacion: number;
    margenVictoria: number;
}

export interface VotosCandidatoVM {
    candidato: string;
    rrv: number;
    oficial: number;
}

export interface RRVvsOficialVM {
    hora: string;
    rrv: number;
    oficial: number;
}

export interface InconsistenciaVM {
    id: string;
    departamento: string;
    recinto: string;
    acta: string;
    diferencia: number;
    estado: string;
}

export interface GeograficoVM {
    id: string;
    departamento: string;
    actasComputadas: number;
    avance: number;
}

export interface TecnicoVM {
    latenciaSms: number | string;
    latenciaDb: number | string;
    erroresApi: number;
    uptime: number;
    mongo: string;
    postgres: string;
    totalActasPg: number;
    totalActasRrv: number;
}

// ─── Llamadas reales ───────────────────────────────────────────────────────

export const dashboardService = {
    getKPIs: async (): Promise<KpisVM> => {
        const { data } = await httpClient.get<ResumenComparacion>("/dashboard/kpis");
        const procesadas = data.actas_consistentes + data.actas_inconsistentes;
        const pendientes = data.actas_solo_rrv + data.actas_solo_oficial;
        // Margen de victoria a partir de votos por candidato
        let margenVictoria = 0;
        try {
            const votos = await dashboardService.getVotosCandidato();
            const totales = votos
                .map((v) => v.oficial || v.rrv)
                .sort((a, b) => b - a);
            const total = totales.reduce((s, n) => s + n, 0) || 1;
            const margen = (totales[0] ?? 0) - (totales[1] ?? 0);
            margenVictoria = Number(((margen / total) * 100).toFixed(2));
        } catch {
            margenVictoria = 0;
        }

        let participacion = 0;
        try {
            const p = await httpClient.get<ParticipacionResponse>("/dashboard/participacion");
            if (p.data.available && p.data.datasets[0]?.data[0] != null) {
                participacion = Number(p.data.datasets[0].data[0]);
            }
        } catch {
            participacion = 0;
        }

        return {
            totalRrv: data.total_actas_rrv,
            totalOficial: data.total_actas_oficial,
            diferencia: data.diferencia_total_votos,
            actasRecibidas: data.total_actas_comparadas,
            actasProcesadas: procesadas,
            actasPendientes: pendientes,
            actasInconsistentes: data.actas_inconsistentes,
            confiabilidad: Number(data.confiabilidad_rrv?.toFixed?.(2) ?? data.confiabilidad_rrv ?? 0),
            participacion,
            margenVictoria,
        };
    },

    getVotosCandidato: async (): Promise<VotosCandidatoVM[]> => {
        const { data } = await httpClient.get<ChartPayload>("/dashboard/votos-candidato");
        const rrvDS = data.datasets.find((d) => d.label.toLowerCase() === "rrv");
        const ofDS = data.datasets.find((d) => d.label.toLowerCase() === "oficial");
        return data.labels.map((label, i) => ({
            candidato: label,
            rrv: Number(rrvDS?.data[i] ?? 0),
            oficial: Number(ofDS?.data[i] ?? 0),
        }));
    },

    getRRVvsOficial: async (): Promise<RRVvsOficialVM[]> => {
        const { data } = await httpClient.get<ChartPayload>("/dashboard/rrv-vs-oficial");
        const counts = data.datasets[0]?.data ?? [];
        return data.labels.map((label, i) => ({
            hora: label,
            rrv: Number(counts[i] ?? 0),
            oficial: 0,
        }));
    },

    getInconsistencias: async (): Promise<InconsistenciaVM[]> => {
        const { data } = await httpClient.get<InconsistenciasResponse>("/dashboard/inconsistencias");
        return (data.inconsistencias ?? []).slice(0, 25).map((a) => ({
            id: a.acta_id,
            acta: a.acta_id,
            departamento: a.departamento || "—",
            recinto: a.recinto || "—",
            diferencia: a.diferencias?.diferencia_total_votos ?? 0,
            estado:
                a.estado_comparacion === "INCONSISTENTE"
                    ? "Pendiente Revisión"
                    : a.estado_comparacion === "SOLO_RRV"
                      ? "Solo RRV"
                      : a.estado_comparacion === "SOLO_OFICIAL"
                        ? "Solo Oficial"
                        : "Resuelto",
        }));
    },

    getGeografico: async (groupBy: "departamento" | "municipio" | "recinto" = "departamento"): Promise<GeograficoVM[]> => {
        const { data } = await httpClient.get<GeograficoResponse>("/dashboard/geografico", {
            params: { group_by: groupBy },
        });
        return (data.items ?? []).map((it, idx) => ({
            id: `${idx}-${it.nombre}`,
            departamento: it.nombre,
            actasComputadas: it.total_actas,
            avance:
                it.total_actas > 0
                    ? Math.round((it.consistentes / it.total_actas) * 100)
                    : 0,
        }));
    },

    getTecnico: async (): Promise<TecnicoVM> => {
        const { data } = await httpClient.get<TecnicoResponse>("/dashboard/tecnico");
        return {
            latenciaSms: data.latencia_ms ?? "—",
            latenciaDb: data.latencia_ms ?? "—",
            erroresApi: 0,
            uptime: data.fuentes.postgresql.estado === "connected" && data.fuentes.mongodb.estado === "connected" ? 100 : 0,
            mongo: data.fuentes.mongodb.estado,
            postgres: data.fuentes.postgresql.estado,
            totalActasPg: data.fuentes.postgresql.total_actas,
            totalActasRrv: data.fuentes.mongodb.total_actas,
        };
    },
};
