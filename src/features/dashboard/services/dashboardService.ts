import { httpClient } from "../../../config/axios";
import type {
    KPIsResponse,
    RRVvsOficialResponse,
    ChartResponse,
    ParticipacionResponse,
    GeograficoResponse,
    TecnicoResponse,
    InconsistenciasResponse,
    ActaComparada,
} from "../models/dashboard.types";

export const dashboardService = {
    getKPIs: () => httpClient.get<KPIsResponse>("/dashboard/kpis"),

    getRRVvsOficial: () => httpClient.get<RRVvsOficialResponse>("/dashboard/rrv-vs-oficial"),

    getVotosCandidato: () => httpClient.get<ChartResponse>("/dashboard/votos-candidato"),

    getParticipacion: () => httpClient.get<ParticipacionResponse>("/dashboard/participacion"),

    getGeografico: (groupBy: "departamento" | "municipio" | "recinto" = "departamento") =>
        httpClient.get<GeograficoResponse>("/dashboard/geografico", {
            params: { group_by: groupBy },
        }),

    getTecnico: () => httpClient.get<TecnicoResponse>("/dashboard/tecnico"),

    getInconsistencias: (page = 1, limit = 20) =>
        httpClient.get<InconsistenciasResponse>("/dashboard/inconsistencias", {
            params: { page, limit },
        }),

    getActaDetalle: (actaId: string) =>
        httpClient.get<ActaComparada>(`/comparacion/${actaId}`),
};
