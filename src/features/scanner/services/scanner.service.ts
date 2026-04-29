import { httpClient } from "../../../config/axios";
import { loadAbort } from "../../../config/load-abort";
import type { UseApiCall } from "../../../config/useApicall";
import type { ActaUploadDataRequest } from "../models/request/acta-upload";
import type { ActaUploadResponse } from "../models/response/acta-upload-response";
import { RrvPath } from "../routes/rrv.route";

export interface RrvListQuery {
    limit?: number;
    offset?: number;
}

export const scannerService = {
    uploadActa: (
        file: File,
        actaData?: ActaUploadDataRequest,
    ): UseApiCall<ActaUploadResponse> => {
        const controller = loadAbort();
        const formData = new FormData();
        formData.append("file", file);
        if (actaData) {
            formData.append("acta_data", JSON.stringify(actaData));
        }
        return {
            call: httpClient.post<ActaUploadResponse>(RrvPath.UploadActa, formData, {
                signal: controller.signal,
            }),
            controller,
        };
    },

    getActas: (q?: RrvListQuery): UseApiCall<ActaUploadResponse[]> => {
        const controller = loadAbort();
        const params: Record<string, number> = {};
        if (q?.limit !== undefined) params.limit = q.limit;
        if (q?.offset !== undefined) params.offset = q.offset;
        return {
            call: httpClient.get<ActaUploadResponse[]>(RrvPath.GetActas, {
                signal: controller.signal,
                params: Object.keys(params).length ? params : undefined,
            }),
            controller,
        };
    },

    getActaById: (actaId: string): UseApiCall<ActaUploadResponse> => {
        const controller = loadAbort();
        return {
            call: httpClient.get<ActaUploadResponse>(RrvPath.GetActaById(actaId), {
                signal: controller.signal,
            }),
            controller,
        };
    },
};
