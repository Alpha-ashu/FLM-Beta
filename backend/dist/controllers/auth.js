"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendVerification = exports.verifyEmail = exports.resetPassword = exports.forgotPassword = exports.refreshToken = exports.logout = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_js_1 = require("../utils/prisma.js");
const email_js_1 = require("../utils/email.js");
const auth_js_1 = require("../utils/auth.js");
const auth_js_2 = require("../validators/auth.js");
const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        const validatedData = auth_js_2.registerSchema.parse({ name, email, password, confirmPassword });
        const existingUser = await prisma_js_1.prisma.user.findUnique({
            where: { email: validatedData.email },
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'User already exists with this email',
            });
        }
        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
        const hashedPassword = await bcryptjs_1.default.hash(validatedData.password, saltRounds);
        const user = await prisma_js_1.prisma.user.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                password: hashedPassword,
                role: 'USER',
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
        const { accessToken, refreshToken } = (0, auth_js_1.generateToken)(user.id, user.email, user.role);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        await (0, email_js_1.sendEmail)({
            to: user.email,
            subject: 'Verify your email address',
            template: 'verify-email',
            data: {
                name: user.name,
                verificationUrl: `${process.env.FRONTEND_URL}/verify-email?token=${accessToken}`,
            },
        });
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user,
                accessToken,
            },
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        res.status(400).json({
            success: false,
            error: errorMessage,
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validatedData = auth_js_2.loginSchema.parse({ email, password });
        const user = await prisma_js_1.prisma.user.findUnique({
            where: { email: validatedData.email },
        });
        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials',
            });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(validatedData.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials',
            });
        }
        const { accessToken, refreshToken } = (0, auth_js_1.generateToken)(user.id, user.email, user.role);
        await prisma_js_1.prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                accessToken,
            },
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        res.status(400).json({
            success: false,
            error: errorMessage,
        });
    }
};
exports.login = login;
const logout = async (req, res) => {
    try {
        res.clearCookie('refreshToken');
        res.json({
            success: true,
            message: 'Logged out successfully',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error',
        });
    }
};
exports.logout = logout;
const refreshToken = async (req, res) => {
    try {
        const { refreshToken: token } = req.cookies;
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'No refresh token provided',
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await prisma_js_1.prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
            },
        });
        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                error: 'Invalid refresh token',
            });
        }
        const { accessToken, refreshToken: newRefreshToken } = (0, auth_js_1.generateToken)(user.id, user.email, user.role);
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({
            success: true,
            data: {
                accessToken,
            },
        });
    }
    catch (error) {
        res.status(401).json({
            success: false,
            error: 'Invalid refresh token',
        });
    }
};
exports.refreshToken = refreshToken;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await prisma_js_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.json({
                success: true,
                message: 'If this email exists, a password reset link has been sent',
            });
        }
        const resetToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        await (0, email_js_1.sendEmail)({
            to: user.email,
            subject: 'Reset your password',
            template: 'password-reset',
            data: {
                name: user.name,
                resetUrl: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
            },
        });
        res.json({
            success: true,
            message: 'If this email exists, a password reset link has been sent',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error',
        });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
        const hashedPassword = await bcryptjs_1.default.hash(password, saltRounds);
        await prisma_js_1.prisma.user.update({
            where: { id: decoded.id },
            data: { password: hashedPassword },
        });
        res.json({
            success: true,
            message: 'Password reset successful',
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: 'Invalid or expired token',
        });
    }
};
exports.resetPassword = resetPassword;
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        await prisma_js_1.prisma.user.update({
            where: { id: decoded.id },
            data: { emailVerified: true },
        });
        res.json({
            success: true,
            message: 'Email verified successfully',
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: 'Invalid or expired verification token',
        });
    }
};
exports.verifyEmail = verifyEmail;
const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await prisma_js_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
            });
        }
        if (user.emailVerified) {
            return res.status(400).json({
                success: false,
                error: 'Email already verified',
            });
        }
        const verificationToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
        await (0, email_js_1.sendEmail)({
            to: user.email,
            subject: 'Verify your email address',
            template: 'verify-email',
            data: {
                name: user.name,
                verificationUrl: `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`,
            },
        });
        res.json({
            success: true,
            message: 'Verification email sent',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error',
        });
    }
};
exports.resendVerification = resendVerification;
//# sourceMappingURL=auth.js.map