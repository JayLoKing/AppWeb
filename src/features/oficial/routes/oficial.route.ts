export const OficialPath = {
    GetActas: "/oficial/actas",
    GetActaById: (actaId: string) => `/oficial/actas/${actaId}`,
    GetAuditoria: "/oficial/auditoria",
    GetErrores: "/oficial/errores",
    GetEventos: "/oficial/eventos",
    UploadCsv: "/oficial/csv/upload",
} as const;
