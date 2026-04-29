import { httpClient } from "../../../config/axios";
import { loadAbort } from "../../../config/load-abort";
import type { UseApiCall } from "../../../config/useApicall";
import type { CrendentialDto } from "../models/request/credential-login";
import type { SuccessPostAuth } from "../models/response/success-post-auth";
import { AuthPath } from "../routes/auth.route";

export const LoginAsync = (credential: CrendentialDto): UseApiCall<SuccessPostAuth> => {
    const controller = loadAbort();
    return {
        call: httpClient.post<SuccessPostAuth>(AuthPath.Login, credential, {
            signal: controller.signal,
        }),
        controller,
    };
};
