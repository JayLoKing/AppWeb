import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { jwtDecoder } from "../../../config/jwtDecode";
import type { SuccessPostAuth } from "../models/response/success-post-auth";

type AuthStore = {
    jwt: string | null;
    userId: number | null;
    username: string | null;
    role: string | null;
    esAdmin: boolean;
    expiresJwt: number | null;
    isAuthenticated: boolean;
    setAuthUser: (data: SuccessPostAuth, username: string) => void;
    clearAuthUser: () => void;
    isExpired: () => boolean;
};

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            jwt: null,
            userId: null,
            username: null,
            role: null,
            esAdmin: false,
            expiresJwt: null,
            isAuthenticated: false,
            setAuthUser: (data, username) => {
                const decoded = jwtDecoder(data.token);
                const expirationTime = Date.now() + data.expiresIn * 1000;
                set({
                    jwt: data.token,
                    userId: decoded.userId,
                    username,
                    role: data.esAdmin ? "ADMIN" : "USER",
                    esAdmin: data.esAdmin,
                    expiresJwt: expirationTime,
                    isAuthenticated: true,
                });
            },
            clearAuthUser: () => {
                set({
                    jwt: null,
                    userId: null,
                    username: null,
                    role: null,
                    esAdmin: false,
                    expiresJwt: null,
                    isAuthenticated: false,
                });
            },
            isExpired: () => {
                const exp = get().expiresJwt;
                return exp == null ? true : Date.now() >= exp;
            },
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => sessionStorage),
        },
    ),
);
