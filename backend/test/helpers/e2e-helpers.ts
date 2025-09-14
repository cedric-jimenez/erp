import { INestApplication } from '@nestjs/common';
import { Server } from 'http';
import { PrismaService } from '../../src/prisma/prisma.service';

/**
 * Helper function to get properly typed HTTP server for supertest
 */
export const getHttpServer = (app: INestApplication): Server => {
  return app.getHttpServer() as Server;
};

/**
 * Common database cleanup helper with foreign key constraint handling
 */
export const cleanupDatabase = async (prisma: PrismaService) => {
  await prisma.$executeRaw`SET session_replication_role = replica;`;
  await prisma.quoteLine.deleteMany({});
  await prisma.quote.deleteMany({});
  await prisma.item.deleteMany({});
  await prisma.$executeRaw`SET session_replication_role = DEFAULT;`;
};
