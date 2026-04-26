import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { jwtDecoder } from "../../../config/jwtDecode";
import type { SuccessPostAuth } from "../models/response/success-post-auth";

type AuthStore = {
    jwt: string | null;
    role: string | null;
    userId: number | null;
    employeeId: number | null;
    username: string | null;
    email: string | null;
    expiresJwt: number | null;
    isAuthenticated: boolean;
    setAuthUser: (data: SuccessPostAuth) => void;
    clearAuthUser: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            jwt: null,
            role: null,
            userId: null,
            employeeId: null,
            username: null,
            email: null,
            expiresJwt: null,
            isAuthenticated: false,
            setAuthUser: (data: SuccessPostAuth) => {
                const decoded = jwtDecoder(data.jwt);
                const expirationTime = Date.now() + data.expiresJwtIn;
                
                set({
                    jwt: data.jwt,
                    role: decoded.role,
                    userId: decoded.id,
                    employeeId: data.info.data.employeeId,
                    username: decoded.sub,
                    email: data.info.data.email,
                    expiresJwt: expirationTime,
                    isAuthenticated: true,
                });
            },
            clearAuthUser: () => {
                set({
                    jwt: null,
                    role: null,
                    userId: null,
                    employeeId: null,
                    username: null,
                    email: null,
                    expiresJwt: null,
                    isAuthenticated: false,
                });
            }
        }),
        {
            name: "auth-storage", 
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
