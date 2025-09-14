/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';

// Types for mock responses
interface MockItem {
  id: number;
  code: string;
  name: string;
  description: string | null;
  unit: string;
  category: string | null;
  stockMin: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

// Types for mock data

import {
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { QuoteStatus } from '@prisma/client';
import { QuotesService } from './quotes.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  createMockPrismaService,
  setupMockPrismaSuccess,
  setupMockPrismaErrors,
  expectQuoteStructure,
  expectPaginationStructure,
  createTestConditions,
  calculateExpectedTotals,
  MockPrismaService,
} from './test/test-helpers';
import { QuoteFactory, QuotePrismaErrors } from './test/quote.factory';
import type { Quote, Item } from '@prisma/client';

describe('QuotesService', () => {
  let service: QuotesService;
  let mockPrisma: MockPrismaService;
  const testConditions = createTestConditions();

  beforeEach(async () => {
    mockPrisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuotesService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<QuotesService>(QuotesService);
  });

  describe('create', () => {
    it('should create a quote with valid data', async () => {
      void setupMockPrismaSuccess(mockPrisma);
      const createDto = QuoteFactory.createDto();

      const result = await service.create(createDto);

      expectQuoteStructure(result);
      expect(result.customerName).toBe(createDto.customerName);
      expect(result.status).toBe(QuoteStatus.DRAFT);
      expect(mockPrisma.item.findMany).toHaveBeenCalledWith({
        where: {
          id: { in: [42] },
          deletedAt: null,
          active: true,
        },
      });
    });

    it('should calculate totals correctly', async () => {
      void setupMockPrismaSuccess(mockPrisma);
      const lines = [
        {
          itemId: 42,
          itemCode: 'TEST1',
          itemName: 'Test 1',
          quantity: 2,
          unitPrice: 100,
        },
        {
          itemId: 43,
          itemCode: 'TEST2',
          itemName: 'Test 2',
          quantity: 1,
          unitPrice: 200,
        },
      ];
      const createDto = QuoteFactory.createDto({ lines });
      const expectedTotals = calculateExpectedTotals(lines);

      const result = await service.create(createDto);

      expect(result.totalAmount.toNumber()).toBe(expectedTotals.totalAmount);
      expect(result.taxAmount.toNumber()).toBe(expectedTotals.taxAmount);
      expect(result.totalWithTax.toNumber()).toBe(expectedTotals.totalWithTax);
    });

    it('should generate unique quote number', async () => {
      void setupMockPrismaSuccess(mockPrisma);
      const createDto = QuoteFactory.createDto();

      const result = await service.create(createDto);

      expect(result.number).toMatch(/^QUO-\d{4}-\d{3}$/);
    });

    it('should throw BadRequestException for invalid items', async () => {
      // Mock pour retourner moins d'articles que demandé
      mockPrisma.item.findMany.mockResolvedValue([]);
      const createDto = QuoteFactory.createDto();

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockPrisma.item.findMany).toHaveBeenCalled();
    });

    it('should throw ConflictException for duplicate quote number', async () => {
      // Setup valid items first
      mockPrisma.item.findMany.mockResolvedValue([
        {
          id: 42,
          code: 'ITEM001',
          name: 'Test Item',
          description: null,
          unit: 'pcs',
          category: null,
          stockMin: 0,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        } as MockItem,
      ]);

      // Then setup quote.create to fail with unique constraint
      mockPrisma.quote.create.mockRejectedValue(
        QuotePrismaErrors.uniqueConstraint,
      );

      const createDto = QuoteFactory.createDto();

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should rethrow non-Prisma errors during create', async () => {
      void setupMockPrismaSuccess(mockPrisma);
      mockPrisma.item.findMany.mockResolvedValue([
        {
          id: 42,
          code: 'ITEM001',
          name: 'Test Item',
          description: null,
          unit: 'pcs',
          category: null,
          stockMin: 0,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        } as MockItem,
      ]);

      // Simulate generic error during create
      const genericError = new Error('Database connection failed');
      mockPrisma.quote.create.mockRejectedValue(genericError);

      const createDto = QuoteFactory.createDto();

      await expect(service.create(createDto)).rejects.toThrow(
        'Database connection failed',
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated quotes', async () => {
      void setupMockPrismaSuccess(mockPrisma);
      const queryDto = { page: 1, limit: 20 };

      const result = await service.findAll(queryDto);

      expectPaginationStructure(result);
      expect(mockPrisma.quote.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null },
        skip: 0,
        take: 20,
        include: { lines: true },
        orderBy: [{ createdAt: 'desc' }],
      });
    });

    it('should filter by status', async () => {
      void setupMockPrismaSuccess(mockPrisma);
      const queryDto = { status: QuoteStatus.SENT };

      await service.findAll(queryDto);

      expect(mockPrisma.quote.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: QuoteStatus.SENT,
          }),
        }),
      );
    });

    it('should search by number and customer name', async () => {
      void setupMockPrismaSuccess(mockPrisma);
      const queryDto = { search: 'QUO-2024' };

      await service.findAll(queryDto);

      expect(mockPrisma.quote.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { number: { contains: 'QUO-2024', mode: 'insensitive' } },
              { customerName: { contains: 'QUO-2024', mode: 'insensitive' } },
            ],
          }),
        }),
      );
    });

    it('should filter by date range', async () => {
      void setupMockPrismaSuccess(mockPrisma);
      const queryDto = {
        dateFrom: '2024-01-01',
        dateTo: '2024-12-31',
      };

      await service.findAll(queryDto);

      expect(mockPrisma.quote.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            createdAt: expect.objectContaining({
              gte: new Date('2024-01-01'),
              lte: expect.any(Date),
            }),
          }),
        }),
      );
    });

    it('should filter by customer name', async () => {
      void setupMockPrismaSuccess(mockPrisma);
      const queryDto = { customerName: 'Client Test' };

      await service.findAll(queryDto);

      expect(mockPrisma.quote.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            customerName: { contains: 'Client Test', mode: 'insensitive' },
          }),
        }),
      );
    });

    it('should filter by dateFrom only', async () => {
      void setupMockPrismaSuccess(mockPrisma);
      const queryDto = { dateFrom: '2024-01-01' };

      await service.findAll(queryDto);

      expect(mockPrisma.quote.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            createdAt: expect.objectContaining({
              gte: new Date('2024-01-01'),
            }),
          }),
        }),
      );
    });

    it('should filter by dateTo only', async () => {
      void setupMockPrismaSuccess(mockPrisma);
      const queryDto = { dateTo: '2024-12-31' };

      await service.findAll(queryDto);

      expect(mockPrisma.quote.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            createdAt: expect.objectContaining({
              lte: expect.any(Date),
            }),
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a quote with lines', async () => {
      void setupMockPrismaSuccess(mockPrisma);

      const result = await service.findOne(testConditions.validId);

      expectQuoteStructure(result);
      expect(mockPrisma.quote.findFirst).toHaveBeenCalledWith({
        where: { id: testConditions.validId, deletedAt: null },
        include: { lines: true },
      });
    });

    it('should throw NotFoundException for non-existent quote', async () => {
      setupMockPrismaErrors(mockPrisma);

      await expect(service.findOne(testConditions.invalidId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a draft quote', async () => {
      const { testQuotes }: { testQuotes: Quote[]; testItems: Item[] } =
        setupMockPrismaSuccess(mockPrisma);
      // Ensure the quote is in DRAFT status
      testQuotes[0].status = QuoteStatus.DRAFT;
      const updateDto = { customerName: 'Updated Client' };

      const result = await service.update(testConditions.validId, updateDto);

      expectQuoteStructure(result);
      expect(result.customerName).toBe('Updated Client');
    });

    it('should recalculate totals when updating lines', async () => {
      const { testQuotes }: { testQuotes: Quote[]; testItems: Item[] } =
        setupMockPrismaSuccess(mockPrisma);
      testQuotes[0].status = QuoteStatus.DRAFT;
      const newLines = [
        {
          itemId: 42,
          itemCode: 'NEW1',
          itemName: 'New 1',
          quantity: 3,
          unitPrice: 150,
        },
      ];
      const updateDto = { lines: newLines };
      const expectedTotals = calculateExpectedTotals(newLines);

      const result = await service.update(testConditions.validId, updateDto);

      expect(result.totalAmount.toNumber()).toBe(expectedTotals.totalAmount);
    });

    it('should throw ConflictException for non-draft quotes', async () => {
      const { testQuotes }: { testQuotes: Quote[]; testItems: Item[] } =
        setupMockPrismaSuccess(mockPrisma);
      testQuotes[0].status = QuoteStatus.SENT;
      const updateDto = { customerName: 'Updated Client' };

      await expect(
        service.update(testConditions.validId, updateDto),
      ).rejects.toThrow(ConflictException);
    });

    it('should validate items when updating lines', async () => {
      const { testQuotes }: { testQuotes: Quote[]; testItems: Item[] } =
        setupMockPrismaSuccess(mockPrisma);
      testQuotes[0].status = QuoteStatus.DRAFT;
      mockPrisma.item.findMany.mockResolvedValue([]); // No items found
      const updateDto = {
        lines: [
          {
            itemId: 999,
            itemCode: 'INVALID',
            itemName: 'Invalid',
            quantity: 1,
            unitPrice: 100,
          },
        ],
      };

      await expect(
        service.update(testConditions.validId, updateDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle database conflict during update', async () => {
      // Setup quote.findFirst to return valid quote first
      const mockQuote = QuoteFactory.create({
        id: testConditions.validId,
        status: QuoteStatus.DRAFT,
      });
      mockPrisma.quote.findFirst.mockResolvedValue(mockQuote);

      // Then simulate P2002 error during update
      mockPrisma.quote.update.mockRejectedValue(
        QuotePrismaErrors.uniqueConstraint,
      );

      const updateDto = { customerName: 'Updated Client' };

      await expect(
        service.update(testConditions.validId, updateDto),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should soft delete a quote', async () => {
      void setupMockPrismaSuccess(mockPrisma);

      const result = await service.remove(testConditions.validId);

      expect(result.deletedAt).toBeInstanceOf(Date);
      expect(mockPrisma.quote.update).toHaveBeenCalledWith({
        where: { id: testConditions.validId },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('should throw ConflictException for accepted quotes', async () => {
      const { testQuotes }: { testQuotes: Quote[]; testItems: Item[] } =
        setupMockPrismaSuccess(mockPrisma);
      testQuotes[0].status = QuoteStatus.ACCEPTED;

      await expect(service.remove(testConditions.validId)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw NotFoundException for non-existent quote', async () => {
      setupMockPrismaErrors(mockPrisma);

      await expect(service.remove(testConditions.invalidId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('sendQuote', () => {
    it('should change status from DRAFT to SENT', async () => {
      const { testQuotes }: { testQuotes: Quote[]; testItems: Item[] } =
        setupMockPrismaSuccess(mockPrisma);
      testQuotes[0].status = QuoteStatus.DRAFT;
      mockPrisma.quote.update.mockResolvedValue({
        ...testQuotes[0],
        status: QuoteStatus.SENT,
      });

      const result = await service.sendQuote(testConditions.validId);

      expect(result.status).toBe(QuoteStatus.SENT);
      expect(mockPrisma.quote.update).toHaveBeenCalledWith({
        where: { id: testConditions.validId },
        data: { status: QuoteStatus.SENT },
        include: { lines: true },
      });
    });

    it('should throw ConflictException for non-draft quotes', async () => {
      const { testQuotes }: { testQuotes: Quote[]; testItems: Item[] } =
        setupMockPrismaSuccess(mockPrisma);
      testQuotes[0].status = QuoteStatus.SENT;

      await expect(service.sendQuote(testConditions.validId)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('acceptQuote', () => {
    it('should change status from SENT to ACCEPTED', async () => {
      const { testQuotes }: { testQuotes: Quote[]; testItems: Item[] } =
        setupMockPrismaSuccess(mockPrisma);
      testQuotes[0].status = QuoteStatus.SENT;
      mockPrisma.quote.update.mockResolvedValue({
        ...testQuotes[0],
        status: QuoteStatus.ACCEPTED,
      });

      const result = await service.acceptQuote(testConditions.validId);

      expect(result.status).toBe(QuoteStatus.ACCEPTED);
    });

    it('should throw ConflictException for non-sent quotes', async () => {
      const { testQuotes }: { testQuotes: Quote[]; testItems: Item[] } =
        setupMockPrismaSuccess(mockPrisma);
      testQuotes[0].status = QuoteStatus.DRAFT;

      await expect(service.acceptQuote(testConditions.validId)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('rejectQuote', () => {
    it('should change status from SENT to REJECTED', async () => {
      const { testQuotes }: { testQuotes: Quote[]; testItems: Item[] } =
        setupMockPrismaSuccess(mockPrisma);
      testQuotes[0].status = QuoteStatus.SENT;
      mockPrisma.quote.update.mockResolvedValue({
        ...testQuotes[0],
        status: QuoteStatus.REJECTED,
      });

      const result = await service.rejectQuote(testConditions.validId);

      expect(result.status).toBe(QuoteStatus.REJECTED);
    });

    it('should throw ConflictException for non-sent quotes', async () => {
      const { testQuotes }: { testQuotes: Quote[]; testItems: Item[] } =
        setupMockPrismaSuccess(mockPrisma);
      testQuotes[0].status = QuoteStatus.ACCEPTED;

      await expect(service.rejectQuote(testConditions.validId)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('markExpiredQuotes', () => {
    it('should mark expired quotes as EXPIRED', async () => {
      void setupMockPrismaSuccess(mockPrisma);

      const result = await service.markExpiredQuotes();

      expect(result.updatedCount).toBe(2);
      expect(mockPrisma.quote.updateMany).toHaveBeenCalledWith({
        where: {
          status: QuoteStatus.SENT,
          validUntil: { lt: expect.any(Date) },
          deletedAt: null,
        },
        data: { status: QuoteStatus.EXPIRED },
      });
    });
  });
});
