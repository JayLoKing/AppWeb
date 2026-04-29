export interface SuccessPostAuth {
    token: string;
    expiresIn: number;
    esAdmin: boolean;
}

export interface AuthErrorResponse {
    error: string;
}
