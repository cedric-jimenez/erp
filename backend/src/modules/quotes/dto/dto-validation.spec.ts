import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateQuoteDto } from './create-quote.dto';
import { QuoteLineDto } from './quote-line.dto';
import { QueryQuotesDto } from './query-quotes.dto';
import { UpdateQuoteDto } from './update-quote.dto';

describe('Quote DTOs Validation', () => {
  describe('CreateQuoteDto', () => {
    it('should handle data transformation', () => {
      const dto = plainToClass(CreateQuoteDto, {
        customerId: 123,
        customerName: 'Client Test',
        customerEmail: 'client@test.com',
        validUntil: '2024-12-31',
        lines: [],
      });

      expect(dto.customerId).toBe(123);
      expect(dto.customerName).toBe('Client Test');
      expect(dto.customerEmail).toBe('client@test.com');
    });

    it('should validate required fields', async () => {
      const dto = plainToClass(CreateQuoteDto, {});

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should handle data transformation', () => {
      const dto = plainToClass(CreateQuoteDto, {
        customerId: '123',
        customerName: 'Client Test',
        validUntil: '2024-12-31',
        lines: [],
      });

      expect(dto.customerId).toBe(123);
    });

    it('should handle data transformation', () => {
      const dto = plainToClass(CreateQuoteDto, {
        customerId: 'invalid',
        customerName: 'Client Test',
        validUntil: '2024-12-31',
        lines: [],
      });

      expect(dto.customerId).toBeNull();
    });

    it('should handle data transformation', () => {
      const dto = plainToClass(CreateQuoteDto, {
        customerId: null,
        customerName: 'Client Test',
        validUntil: '2024-12-31',
        lines: [],
      });

      expect(dto.customerId).toBeNull();
    });

    it('should validate email format', async () => {
      const dto = plainToClass(CreateQuoteDto, {
        customerName: 'Client Test',
        customerEmail: 'invalid-email',
        validUntil: '2024-12-31',
        lines: [],
      });

      const errors = await validate(dto);
      const emailError = errors.find(
        (error) => error.property === 'customerEmail',
      );
      expect(emailError).toBeDefined();
    });
  });

  describe('QuoteLineDto', () => {
    it('should handle data transformation', () => {
      const dto = plainToClass(QuoteLineDto, {
        itemId: 1,
        itemCode: 'ITEM001',
        itemName: 'Test Item',
        quantity: 2,
        unitPrice: 100.5,
      });

      expect(dto.itemId).toBe(1);
      expect(dto.itemCode).toBe('ITEM001');
      expect(dto.itemName).toBe('Test Item');
    });

    it('should handle data transformation', () => {
      const dto = plainToClass(QuoteLineDto, {
        itemId: 1,
        itemCode: 'ITEM001',
        itemName: 'Test Item',
        quantity: 1,
        unitPrice: 100,
      });

      expect(dto.quantity).toBe(1);
      expect(dto.unitPrice).toBe(100);
    });
  });

  describe('QueryQuotesDto', () => {
    it('should validate QueryQuotesDto with all fields', async () => {
      const dto = plainToClass(QueryQuotesDto, {
        page: 1,
        limit: 20,
        search: 'QUO-2024',
        status: 'DRAFT',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should handle data transformation', () => {
      const dto = plainToClass(QueryQuotesDto, {});

      expect(dto.page).toBe(1);
      expect(dto.limit).toBe(20);
    });

    it('should handle data transformation', () => {
      const dto = plainToClass(QueryQuotesDto, {
        page: '5',
        limit: '25',
      });

      expect(dto.page).toBe(5);
      expect(dto.limit).toBe(25);
    });

    it('should handle data transformation', () => {
      const dto = plainToClass(QueryQuotesDto, {
        page: 'invalid',
        limit: 'invalid',
      });

      expect(dto.page).toBe(1);
      expect(dto.limit).toBe(20);
    });

    it('should handle data transformation', () => {
      const dto = plainToClass(QueryQuotesDto, {
        page: null,
        limit: undefined,
      });

      expect(dto.page).toBe(1);
      expect(dto.limit).toBe(20);
    });

    it('should validate QueryQuotesDto with full data', async () => {
      const dto = plainToClass(QueryQuotesDto, {
        page: 2,
        limit: 50,
        search: 'test',
        status: 'SENT',
        customerName: 'Client Test',
        dateFrom: '2024-01-01',
        dateTo: '2024-12-31',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('UpdateQuoteDto', () => {
    it('should validate UpdateQuoteDto', async () => {
      const dto = plainToClass(UpdateQuoteDto, {
        customerName: 'Updated Name',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should handle data transformation', () => {
      const dto = plainToClass(UpdateQuoteDto, {
        customerName: 'Updated Client',
        customerEmail: 'updated@client.com',
      });

      expect(dto.customerName).toBe('Updated Client');
      expect(dto.customerEmail).toBe('updated@client.com');
    });
  });
});
