import { jwtDecode, type JwtPayload } from "jwt-decode";

export interface DecodedJWT  extends JwtPayload {
    id: number;
    sub: string;
    role: string;
    email: string;
}

export function jwtDecoder(token: string): DecodedJWT {
    try {
        const decoded = jwtDecode<DecodedJWT>(token);
        return decoded;
    } catch (error) {
        console.error("Failed to decode JWT:", error);
        throw new Error("Invalid JWT token");
    }
}
