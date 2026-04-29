export const RrvPath = {
    UploadActa: "/rrv/actas/upload",
    GetActas: "/rrv/actas",
    GetActaById: (actaId: string) => `/rrv/actas/${actaId}`,
    GetEventos: "/rrv/eventos",
} as const;
