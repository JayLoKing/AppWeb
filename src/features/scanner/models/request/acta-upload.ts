export interface CandidatoRequest {
    candidato_id: string;
    nombre: string;
    votos: number;
}

export interface ActaUploadDataRequest {
    acta_id: string;
    departamento: string;
    municipio: string;
    recinto: string;
    mesa: string;
    candidatos: CandidatoRequest[];
    votos_nulos: number;
    votos_blancos: number;
    total_votos: number;
}

export interface ActaUploadRequest {
    file: File;
    acta_data?: ActaUploadDataRequest;
}
