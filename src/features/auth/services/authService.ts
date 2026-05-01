import { httpClient } from "../../../config/axios";
import type { LoginResponse } from "../models/response/success-post-auth";

export interface LoginPayload {
    usuario: string;
    contrasena: string;
}

export const authService = {
    login: async (payload: LoginPayload): Promise<LoginResponse> => {
        const { data } = await httpClient.post<LoginResponse>("/auth/login", payload);
        return data;
    },
    me: async () => {
        const { data } = await httpClient.get("/auth/me");
        return data;
    },
};
