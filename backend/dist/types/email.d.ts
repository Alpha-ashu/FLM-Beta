export interface EmailTemplate {
    html: string;
    text: string;
}
export interface EmailData {
    name: string;
    verificationUrl?: string;
    resetUrl?: string;
    message?: string;
    ip?: string;
}
//# sourceMappingURL=email.d.ts.map