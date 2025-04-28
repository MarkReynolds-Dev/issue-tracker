import { PrismaClient } from "@/app/generated/prisma";

// 确保开发环境中不会创建多个Prisma实例
const globalForPrisma = global;

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
