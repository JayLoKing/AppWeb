export interface EventoOficialResponse {
    id: number;
    auditoria_id?: number;
    tipo: string;
    fuente: string;
    payload?: unknown;
    error?: string;
    created_at: string;
}
