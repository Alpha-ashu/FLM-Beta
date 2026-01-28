"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const auth_js_1 = __importDefault(require("./routes/auth.js"));
const errorHandler_js_1 = require("./middleware/errorHandler.js");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://api.example.com"],
            fontSrc: ["'self'", "https://fonts.googleapis.com"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
}));
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, morgan_1.default)('dev'));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use('/api/v1/auth', auth_js_1.default);
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'FinanceLife Backend API is running',
        timestamp: new Date().toISOString(),
        version: process.env.API_VERSION || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
    });
});
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to FinanceLife Backend API',
        documentation: '/api/v1/docs',
        health: '/api/v1/health',
        version: process.env.API_VERSION || '1.0.0',
    });
});
app.use(errorHandler_js_1.notFound);
app.use(errorHandler_js_1.errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/v1/health`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api/v1/docs`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});
exports.default = app;
//# sourceMappingURL=index.js.map