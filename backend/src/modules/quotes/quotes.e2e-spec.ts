import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request, { Response } from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../prisma/prisma.service';
import {
  getHttpServer,
  cleanupDatabase,
} from '../../../test/helpers/e2e-helpers';
import {
  QuoteResponse,
  PaginatedResponse,
} from '../../../test/types/api-responses';

describe('Quotes E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const testItem = {
    code: 'QUOTE-TEST-001',
    name: 'Test Item for Quotes',
    description: 'Item for testing quotes',
    unit: 'pcs',
    category: 'Test',
    stockMin: 10,
    active: true,
  };

  const testQuote = {
    customerId: 123,
    customerName: 'Test Customer',
    customerEmail: 'test@customer.com',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    lines: [
      {
        itemId: 0, // Will be set after item creation
        itemCode: 'QUOTE-TEST-001',
        itemName: 'Test Item for Quotes',
        quantity: 2,
        unitPrice: 100.0,
      },
    ],
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);
    await app.init();

    await cleanupDatabase(prisma);
  });

  afterAll(async () => {
    await cleanupDatabase(prisma);
    await prisma.$disconnect();
    await app.close();
  });

  describe('POST /api/v1/quotes', () => {
    it('should create quote successfully', async () => {
      // Arrange - Create test item first
      const createdItem = await prisma.item.create({
        data: testItem,
      });

      const quoteData = {
        ...testQuote,
        lines: [
          {
            ...testQuote.lines[0],
            itemId: createdItem.id,
          },
        ],
      };

      // Act
      const response: Response = await request(getHttpServer(app))
        .post('/api/v1/quotes')
        .send(quoteData)
        .expect(201);

      // Assert
      const createdQuote = response.body as QuoteResponse;
      expect(createdQuote).toBeDefined();
      expect(createdQuote.customerName).toBe(testQuote.customerName);
      expect(createdQuote.lines).toHaveLength(1);
      expect(createdQuote.lines[0]?.itemId).toBe(createdItem.id);
    });
  });

  describe('GET /api/v1/quotes', () => {
    it('should return quotes list with pagination', async () => {
      // Arrange - Create test item and quote
      const createdItem = await prisma.item.create({
        data: testItem,
      });

      await request(getHttpServer(app))
        .post('/api/v1/quotes')
        .send({
          ...testQuote,
          lines: [
            {
              ...testQuote.lines[0],
              itemId: createdItem.id,
            },
          ],
        })
        .expect(201);

      // Act
      const response: Response = await request(getHttpServer(app))
        .get('/api/v1/quotes')
        .expect(200);

      // Assert
      const result = response.body as PaginatedResponse<QuoteResponse>;
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('pagination');
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/v1/quotes/:id', () => {
    it('should return quote by id with lines', async () => {
      // Arrange - Create test item and quote
      const createdItem = await prisma.item.create({
        data: testItem,
      });

      const createResponse: Response = await request(getHttpServer(app))
        .post('/api/v1/quotes')
        .send({
          ...testQuote,
          lines: [
            {
              ...testQuote.lines[0],
              itemId: createdItem.id,
            },
          ],
        })
        .expect(201);

      const createdQuote = createResponse.body as QuoteResponse;

      // Act
      const response: Response = await request(getHttpServer(app))
        .get(`/api/v1/quotes/${createdQuote.id}`)
        .expect(200);

      // Assert
      const foundQuote = response.body as QuoteResponse;
      expect(foundQuote).toBeDefined();
      expect(foundQuote.id).toBe(createdQuote.id);
      expect(foundQuote.lines).toBeDefined();
      expect(foundQuote.lines.length).toBeGreaterThan(0);
    });

    it('should return 404 for non-existent quote', async () => {
      // Act & Assert
      await request(getHttpServer(app)).get('/api/v1/quotes/999').expect(404);
    });
  });

  describe('DELETE /api/v1/quotes/:id', () => {
    it('should soft delete quote successfully', async () => {
      // Arrange - Create test item and quote
      const createdItem = await prisma.item.create({
        data: testItem,
      });

      const createResponse: Response = await request(getHttpServer(app))
        .post('/api/v1/quotes')
        .send({
          ...testQuote,
          lines: [
            {
              ...testQuote.lines[0],
              itemId: createdItem.id,
            },
          ],
        })
        .expect(201);

      const createdQuote = createResponse.body as QuoteResponse;

      // Act
      await request(getHttpServer(app))
        .delete(`/api/v1/quotes/${createdQuote.id}`)
        .expect(204);

      // Assert - Quote should be soft deleted
      const deletedQuote = await prisma.quote.findFirst({
        where: { id: createdQuote.id },
      });
      expect(deletedQuote?.deletedAt).not.toBeNull();
    });

    it('should return 404 for non-existent quote', async () => {
      // Act & Assert
      await request(getHttpServer(app))
        .delete('/api/v1/quotes/999')
        .expect(404);
    });
  });

  describe('PATCH /api/v1/quotes/:id/send', () => {
    it('should send quote successfully', async () => {
      // Arrange - Create test item and quote
      const createdItem = await prisma.item.create({
        data: testItem,
      });

      const createResponse: Response = await request(getHttpServer(app))
        .post('/api/v1/quotes')
        .send({
          ...testQuote,
          lines: [
            {
              ...testQuote.lines[0],
              itemId: createdItem.id,
            },
          ],
        })
        .expect(201);

      const createdQuote = createResponse.body as QuoteResponse;

      // Act
      const response: Response = await request(getHttpServer(app))
        .patch(`/api/v1/quotes/${createdQuote.id}/send`)
        .expect(200);

      // Assert
      const sentQuote = response.body as QuoteResponse;
      expect(sentQuote.status).toBe('SENT');
    });

    it('should return 404 for non-existent quote', async () => {
      // Act & Assert
      await request(getHttpServer(app))
        .patch('/api/v1/quotes/999/send')
        .expect(404);
    });
  });
});
