export interface CandidatoResponse {
    candidato_id: string;
    nombre: string;
    votos: number;
}

export interface ActaUploadResponse {
    id: string;
    acta_id: string;
    departamento: string;
    municipio: string;
    recinto: string;
    mesa: string;
    candidatos: CandidatoResponse[];
    votos_nulos: number;
    votos_blancos: number;
    total_votos: number;
    estado: "PROCESADA" | "INCONSISTENTE" | string;
    fuente: string;
    tipo_entrada: string;
    hash_origen: string;
    fecha_recepcion: string;
}

export interface ActaUploadErrorResponse {
    error: string;
    acta_id?: string;
    hash?: string;
}
