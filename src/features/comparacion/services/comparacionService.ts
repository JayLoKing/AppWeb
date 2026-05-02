import { httpClient } from "../../../config/axios";
import type { ResumenComparacion, ActaComparada } from "../../dashboard/services/dashboardService";

export interface ComparacionListParams {
    estado?: string;
    departamento?: string;
    municipio?: string;
    recinto?: string;
    pagina?: number;
    por_pagina?: number;
}

export interface ComparacionListResponse {
    actas: ActaComparada[];
    total: number;
    pagina: number;
    por_pagina: number;
    resumen?: ResumenComparacion;
}

export const comparacionService = {
    list: (params: ComparacionListParams = {}): Promise<ComparacionListResponse> =>
        httpClient
            .get<ComparacionListResponse>("/comparacion", { params })
            .then((r) => r.data),
};
