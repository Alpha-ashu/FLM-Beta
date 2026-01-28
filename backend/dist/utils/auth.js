"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResetToken = exports.generateVerificationToken = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (id, email, role) => {
    const accessToken = jsonwebtoken_1.default.sign({ id, email, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
    const refreshToken = jsonwebtoken_1.default.sign({ id, email, role }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
};
exports.verifyToken = verifyToken;
const generateVerificationToken = (id, email) => {
    return jsonwebtoken_1.default.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: '24h' });
};
exports.generateVerificationToken = generateVerificationToken;
const generateResetToken = (id, email) => {
    return jsonwebtoken_1.default.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
exports.generateResetToken = generateResetToken;
//# sourceMappingURL=auth.js.map