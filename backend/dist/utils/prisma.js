"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.prisma = prisma;
prisma.$use(async (params, next) => {
    try {
        const result = await next(params);
        return result;
    }
    catch (error) {
        console.error('Prisma query error:', error);
        throw error;
    }
});
//# sourceMappingURL=prisma.js.map