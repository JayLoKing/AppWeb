import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import type { SuccessPostAuth } from "../models/response/success-post-auth";

type AuthStore = {
    jwt: string | null;
    role: string | null;
    username: string | null;
    expiresJwt: number | null;
    isAuthenticated: boolean;
    esAdmin: boolean;
    setAuthUser: (data: SuccessPostAuth) => void;
    clearAuthUser: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            jwt: null,
            role: null,
            username: null,
            expiresJwt: null,
            isAuthenticated: false,
            esAdmin: false,
            setAuthUser: (data: SuccessPostAuth) => {
                let username: string | null = null;
                try {
                    const decoded = jwtDecode<{ sub?: string }>(data.token);
                    username = decoded.sub ?? null;
                } catch {
                    // token decode failed, username stays null
                }
                set({
                    jwt: data.token,
                    role: data.esAdmin ? "ADMIN" : "USER",
                    esAdmin: data.esAdmin,
                    username,
                    expiresJwt: Date.now() + data.expiresIn * 1000,
                    isAuthenticated: true,
                });
            },
            clearAuthUser: () => {
                set({
                    jwt: null,
                    role: null,
                    username: null,
                    expiresJwt: null,
                    isAuthenticated: false,
                    esAdmin: false,
                });
            },
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
