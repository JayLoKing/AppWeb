export interface ActaDataResponse {
    id: string;
    acta_id: string;
    departamento: string;
    municipio: string;
    recinto: string;
    mesa: string;
    candidatos: Candidate[];
    votos_nulos: number;
    votos_blancos: number;
    total_votos: number;
    estado: string;
    fuente: string;
    tipo_entrada: string;
    fecha_recepcion: string;
}

export interface Candidate {
    candidato_id: string;
    nombre: string;
    votos: number;
}
