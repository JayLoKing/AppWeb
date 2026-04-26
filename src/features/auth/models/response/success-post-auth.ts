export interface SuccessPostAuth {
    jwt: string;
    expiresJwtIn: number;
    info: {
        data: {
            employeeId: number;
            email: string;
        }
    };
}
