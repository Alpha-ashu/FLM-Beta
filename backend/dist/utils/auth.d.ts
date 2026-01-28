interface TokenPayload {
    id: string;
    email: string;
    role: string;
}
export declare const generateToken: (id: string, email: string, role: string) => {
    accessToken: string;
    refreshToken: string;
};
export declare const verifyToken: (token: string) => TokenPayload;
export declare const generateVerificationToken: (id: string, email: string) => string;
export declare const generateResetToken: (id: string, email: string) => string;
export {};
//# sourceMappingURL=auth.d.ts.map