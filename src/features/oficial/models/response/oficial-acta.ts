export interface OficialCandidato {
    candidato_id: string;
    nombre: string;
    votos: number;
}

export interface OficialActaResponse {
    acta_id: string;
    departamento: string;
    provincia: string;
    municipio: string;
    recinto: string;
    mesa: string;
    candidatos: OficialCandidato[];
    votos_nulos: number;
    votos_blancos: number;
    total_votos: number;
    estado: string;
    fuente: string;
}
