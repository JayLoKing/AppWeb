import { httpClient } from "../../../config/axios";
import { loadAbort } from "../../../config/load-abort";
import type { UseApiCall } from "../../../config/useApicall";
import type { ListQueryParams } from "../models/request/list-query";
import type { AuditoriaResponse } from "../models/response/auditoria";
import type { ErrorActaResponse } from "../models/response/error-acta";
import type { EventoOficialResponse } from "../models/response/evento";
import type { OficialActaResponse } from "../models/response/oficial-acta";
import { OficialPath } from "../routes/oficial.route";

const buildParams = (q?: ListQueryParams) => {
    if (!q) return undefined;
    const params: Record<string, number> = {};
    if (q.limit !== undefined) params.limit = q.limit;
    if (q.offset !== undefined) params.offset = q.offset;
    return params;
};

export const oficialService = {
    getActas: (q?: ListQueryParams): UseApiCall<OficialActaResponse[]> => {
        const controller = loadAbort();
        return {
            call: httpClient.get<OficialActaResponse[]>(OficialPath.GetActas, {
                signal: controller.signal,
                params: buildParams(q),
            }),
            controller,
        };
    },

    getActaById: (actaId: string): UseApiCall<OficialActaResponse> => {
        const controller = loadAbort();
        return {
            call: httpClient.get<OficialActaResponse>(OficialPath.GetActaById(actaId), {
                signal: controller.signal,
            }),
            controller,
        };
    },

    getAuditoria: (): UseApiCall<AuditoriaResponse[]> => {
        const controller = loadAbort();
        return {
            call: httpClient.get<AuditoriaResponse[]>(OficialPath.GetAuditoria, {
                signal: controller.signal,
            }),
            controller,
        };
    },

    getErrores: (q?: ListQueryParams): UseApiCall<ErrorActaResponse[]> => {
        const controller = loadAbort();
        return {
            call: httpClient.get<ErrorActaResponse[]>(OficialPath.GetErrores, {
                signal: controller.signal,
                params: buildParams(q),
            }),
            controller,
        };
    },

    getEventos: (): UseApiCall<EventoOficialResponse[]> => {
        const controller = loadAbort();
        return {
            call: httpClient.get<EventoOficialResponse[]>(OficialPath.GetEventos, {
                signal: controller.signal,
            }),
            controller,
        };
    },
};
