import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Enhanced error handling for Prisma
prisma.$use(async (params: any, next: any) => {
  try {
    const result = await next(params);
    return result;
  } catch (error) {
    console.error('Prisma query error:', error);
    throw error;
  }
});

export { prisma };