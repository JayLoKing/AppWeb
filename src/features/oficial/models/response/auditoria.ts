export interface AuditoriaResponse {
    id: number;
    nombre_archivo: string;
    usuario: string;
    fecha_carga: string;
    filas_procesadas: number;
    filas_validas: number;
    filas_rechazadas: number;
    estado: string;
}
