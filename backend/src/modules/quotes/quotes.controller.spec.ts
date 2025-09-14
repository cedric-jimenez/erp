import { Test, TestingModule } from '@nestjs/testing';
import { QuoteStatus } from '@prisma/client';
import { QuotesController } from './quotes.controller';
import { QuotesService } from './quotes.service';
import { QuoteFactory } from './test/quote.factory';
import {
  expectQuoteStructure,
  expectPaginationStructure,
  createTestConditions,
} from './test/test-helpers';

describe('QuotesController', () => {
  let controller: QuotesController;
  let service: QuotesService;
  const testConditions = createTestConditions();

  const mockQuotesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    sendQuote: jest.fn(),
    acceptQuote: jest.fn(),
    rejectQuote: jest.fn(),
    markExpiredQuotes: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuotesController],
      providers: [
        {
          provide: QuotesService,
          useValue: mockQuotesService,
        },
      ],
    }).compile();

    controller = module.get<QuotesController>(QuotesController);
    service = module.get<QuotesService>(QuotesService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new quote', async () => {
      const createDto = QuoteFactory.createDto();
      const expectedQuote = QuoteFactory.createWithMultipleLines(2);
      mockQuotesService.create.mockResolvedValue(expectedQuote);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expectQuoteStructure(result);
      expect(result).toEqual(expectedQuote);
    });

    it('should handle creation errors', async () => {
      const createDto = QuoteFactory.createDto();
      const error = new Error('Creation failed');
      mockQuotesService.create.mockRejectedValue(error);

      await expect(controller.create(createDto)).rejects.toThrow(
        'Creation failed',
      );
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated quotes', async () => {
      const queryDto = { page: 1, limit: 20 };
      const quotes = QuoteFactory.createMany(3);
      const paginatedResult = {
        data: quotes,
        pagination: {
          page: 1,
          limit: 20,
          total: 3,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        },
      };
      mockQuotesService.findAll.mockResolvedValue(paginatedResult);

      const result = await controller.findAll(queryDto);

      expect(service.findAll).toHaveBeenCalledWith(queryDto);
      expectPaginationStructure(result);
      expect(result.data).toHaveLength(3);
    });

    it('should handle query filters', async () => {
      const queryDto = {
        status: QuoteStatus.SENT,
        search: 'QUO-2024',
        customerName: 'ACME',
      };
      const paginatedResult = {
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrevious: false,
        },
      };
      mockQuotesService.findAll.mockResolvedValue(paginatedResult);

      const result = await controller.findAll(queryDto);

      expect(service.findAll).toHaveBeenCalledWith(queryDto);
      expect(result.data).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('should return a quote by id', async () => {
      const expectedQuote = QuoteFactory.createWithMultipleLines(2);
      mockQuotesService.findOne.mockResolvedValue(expectedQuote);

      const result = await controller.findOne(testConditions.validId);

      expect(service.findOne).toHaveBeenCalledWith(testConditions.validId);
      expectQuoteStructure(result);
      expect(result).toEqual(expectedQuote);
    });

    it('should handle not found errors', async () => {
      const error = new Error('Quote not found');
      mockQuotesService.findOne.mockRejectedValue(error);

      await expect(
        controller.findOne(testConditions.invalidId),
      ).rejects.toThrow('Quote not found');
      expect(service.findOne).toHaveBeenCalledWith(testConditions.invalidId);
    });
  });

  describe('update', () => {
    it('should update a quote', async () => {
      const updateDto = { customerName: 'Updated Client' };
      const updatedQuote = QuoteFactory.create({
        customerName: 'Updated Client',
      });
      mockQuotesService.update.mockResolvedValue(updatedQuote);

      const result = await controller.update(testConditions.validId, updateDto);

      expect(service.update).toHaveBeenCalledWith(
        testConditions.validId,
        updateDto,
      );
      expectQuoteStructure(result);
      expect(result.customerName).toBe('Updated Client');
    });

    it('should handle update errors', async () => {
      const updateDto = { customerName: 'Updated Client' };
      const error = new Error('Update failed');
      mockQuotesService.update.mockRejectedValue(error);

      await expect(
        controller.update(testConditions.validId, updateDto),
      ).rejects.toThrow('Update failed');
      expect(service.update).toHaveBeenCalledWith(
        testConditions.validId,
        updateDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a quote', async () => {
      const deletedQuote = QuoteFactory.create({
        deletedAt: new Date(),
      });
      mockQuotesService.remove.mockResolvedValue(deletedQuote);

      await controller.remove(testConditions.validId);

      expect(service.remove).toHaveBeenCalledWith(testConditions.validId);
    });

    it('should handle removal errors', async () => {
      const error = new Error('Cannot delete accepted quote');
      mockQuotesService.remove.mockRejectedValue(error);

      await expect(controller.remove(testConditions.validId)).rejects.toThrow(
        'Cannot delete accepted quote',
      );
      expect(service.remove).toHaveBeenCalledWith(testConditions.validId);
    });
  });

  describe('Error Handling', () => {
    it('should handle service errors in findAll', async () => {
      mockQuotesService.findAll.mockRejectedValue(new Error('Database error'));

      await expect(controller.findAll({})).rejects.toThrow('Database error');
    });

    it('should handle service errors in create', async () => {
      const createDto = QuoteFactory.createDto();
      mockQuotesService.create.mockRejectedValue(new Error('Creation error'));

      await expect(controller.create(createDto)).rejects.toThrow(
        'Creation error',
      );
    });

    it('should handle service errors in update', async () => {
      const updateDto = { customerName: 'Updated' };
      mockQuotesService.update.mockRejectedValue(new Error('Update error'));

      await expect(controller.update(1, updateDto)).rejects.toThrow(
        'Update error',
      );
    });

    it('should handle service errors in findOne', async () => {
      mockQuotesService.findOne.mockRejectedValue(new Error('Not found'));

      await expect(controller.findOne(999)).rejects.toThrow('Not found');
    });
  });

  describe('sendQuote', () => {
    it('should send a quote', async () => {
      const sentQuote = QuoteFactory.create({
        status: QuoteStatus.SENT,
      });
      mockQuotesService.sendQuote.mockResolvedValue(sentQuote);

      const result = await controller.sendQuote(testConditions.validId);

      expect(service.sendQuote).toHaveBeenCalledWith(testConditions.validId);
      expectQuoteStructure(result);
      expect(result.status).toBe(QuoteStatus.SENT);
    });

    it('should handle send errors', async () => {
      const error = new Error('Quote is not in draft status');
      mockQuotesService.sendQuote.mockRejectedValue(error);

      await expect(
        controller.sendQuote(testConditions.validId),
      ).rejects.toThrow('Quote is not in draft status');
      expect(service.sendQuote).toHaveBeenCalledWith(testConditions.validId);
    });
  });

  describe('acceptQuote', () => {
    it('should accept a quote', async () => {
      const acceptedQuote = QuoteFactory.create({
        status: QuoteStatus.ACCEPTED,
      });
      mockQuotesService.acceptQuote.mockResolvedValue(acceptedQuote);

      const result = await controller.acceptQuote(testConditions.validId);

      expect(service.acceptQuote).toHaveBeenCalledWith(testConditions.validId);
      expectQuoteStructure(result);
      expect(result.status).toBe(QuoteStatus.ACCEPTED);
    });

    it('should handle accept errors', async () => {
      const error = new Error('Quote is not sent');
      mockQuotesService.acceptQuote.mockRejectedValue(error);

      await expect(
        controller.acceptQuote(testConditions.validId),
      ).rejects.toThrow('Quote is not sent');
      expect(service.acceptQuote).toHaveBeenCalledWith(testConditions.validId);
    });
  });

  describe('rejectQuote', () => {
    it('should reject a quote', async () => {
      const rejectedQuote = QuoteFactory.create({
        status: QuoteStatus.REJECTED,
      });
      mockQuotesService.rejectQuote.mockResolvedValue(rejectedQuote);

      const result = await controller.rejectQuote(testConditions.validId);

      expect(service.rejectQuote).toHaveBeenCalledWith(testConditions.validId);
      expectQuoteStructure(result);
      expect(result.status).toBe(QuoteStatus.REJECTED);
    });

    it('should handle reject errors', async () => {
      const error = new Error('Quote is not sent');
      mockQuotesService.rejectQuote.mockRejectedValue(error);

      await expect(
        controller.rejectQuote(testConditions.validId),
      ).rejects.toThrow('Quote is not sent');
      expect(service.rejectQuote).toHaveBeenCalledWith(testConditions.validId);
    });
  });

  describe('markExpiredQuotes', () => {
    it('should mark expired quotes', async () => {
      const result = { updatedCount: 3 };
      mockQuotesService.markExpiredQuotes.mockResolvedValue(result);

      const response = await controller.markExpiredQuotes();

      expect(service.markExpiredQuotes).toHaveBeenCalled();
      expect(response.updatedCount).toBe(3);
    });

    it('should handle no expired quotes', async () => {
      const result = { updatedCount: 0 };
      mockQuotesService.markExpiredQuotes.mockResolvedValue(result);

      const response = await controller.markExpiredQuotes();

      expect(service.markExpiredQuotes).toHaveBeenCalled();
      expect(response.updatedCount).toBe(0);
    });
  });
});
