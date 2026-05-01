export interface KPIsResponse {
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

export interface ChartDataset {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
}

export interface ChartResponse {
    labels: string[];
    datasets: ChartDataset[];
}

export interface RRVvsOficialResponse extends ChartResponse {
    raw: {
        actas_consistentes: number;
        actas_inconsistentes: number;
        actas_solo_rrv: number;
        actas_solo_oficial: number;
        confiabilidad_rrv: number;
    };
}

export interface ParticipacionResponse {
    available: boolean;
    message?: string;
    labels: string[];
    datasets: ChartDataset[];
    raw?: {
        total_habilitados: number;
        total_votos: number;
    };
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

export interface TecnicoFuente {
    estado: string;
    total_actas: number;
    coleccion?: string;
    tabla?: string;
}

export interface TecnicoResponse {
    timestamp: string;
    latencia_ms: number | null;
    throughput_actas_min: number | null;
    disponibilidad: string;
    seguridad: {
        jwt_required: boolean;
        https_requerido: boolean;
    };
    fuentes: {
        mongodb: TecnicoFuente;
        postgresql: TecnicoFuente;
    };
    modulo_comparacion: {
        cqrs_mode: string;
        modifica_datos: boolean;
        version: string;
    };
}

export interface CandidatoVotosItem {
    candidato_id: string;
    nombre: string;
    votos_oficial: number;
    votos_rrv: number;
    diferencia: number;
}

export interface InconsistenciaItem {
    acta_id: string;
    tipo_inconsistencia: string;
    descripcion: string;
    severidad: "ALTA" | "MEDIA" | "BAJA";
    fuente_afectada: "RRV" | "OFICIAL" | "AMBAS";
}

export interface ActaComparada {
    acta_id: string;
    departamento: string;
    provincia: string;
    municipio: string;
    recinto: string;
    mesa: string;
    estado_comparacion: "CONSISTENTE" | "INCONSISTENTE" | "SOLO_RRV" | "SOLO_OFICIAL";
    datos_rrv?: ActaFuente;
    datos_oficial?: ActaFuente;
    diferencias?: DiferenciaActa;
    inconsistencias?: InconsistenciaItem[];
}

export interface ActaFuente {
    acta_id: string;
    departamento: string;
    provincia: string;
    municipio: string;
    recinto: string;
    mesa: string;
    candidatos: { candidato_id: string; nombre: string; votos: number }[];
    votos_nulos: number;
    votos_blancos: number;
    total_votos: number;
    estado: string;
    fuente: "RRV" | "OFICIAL";
}

export interface DiferenciaActa {
    diferencia_total_votos: number;
    diferencia_votos_nulos: number;
    diferencia_votos_blancos: number;
    diferencia_por_candidato?: CandidatoVotosItem[];
}

export interface InconsistenciasResponse {
    resumen: KPIsResponse;
    inconsistencias: ActaComparada[];
    total: number;
}
