export interface DashboardKpis {
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

export interface VotosCandidatoView {
    candidato: string;
    rrv: number;
    oficial: number;
}

export interface ParticipacionView {
    departamento: string;
    porcentaje: number;
}

export interface InconsistenciaView {
    id: number | string;
    departamento: string;
    recinto: string;
    acta: string;
    diferencia: number;
    estado: string;
}

export interface RrvVsOficialPoint {
    hora: string;
    rrv: number;
    oficial: number;
}

export interface GeograficoView {
    id: number | string;
    departamento: string;
    actasComputadas: number;
    avance: number;
}

export interface TecnicoView {
    latenciaSms: number;
    latenciaDb: number;
    erroresApi: number;
    uptime: number;
}
