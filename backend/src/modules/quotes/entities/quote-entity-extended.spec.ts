import { Quote } from './quote.entity';
import { QuoteStatus } from '@prisma/client';

describe('Quote Entity Extended', () => {
  describe('Quote entity structure', () => {
    it('should create quote entity with all required fields', () => {
      const quote = new Quote();
      quote.id = 1;
      quote.number = 'QUO-2024-001';
      quote.customerName = 'Test Customer';
      quote.status = QuoteStatus.DRAFT;
      quote.totalAmount = 100.0;
      quote.taxAmount = 20.0;
      quote.totalWithTax = 120.0;
      quote.validUntil = new Date('2024-12-31T23:59:59.000Z');
      quote.createdAt = new Date('2024-08-15T10:30:00.000Z');
      quote.updatedAt = new Date('2024-08-15T10:30:00.000Z');

      expect(quote.id).toBe(1);
      expect(quote.number).toBe('QUO-2024-001');
      expect(quote.customerName).toBe('Test Customer');
      expect(quote.status).toBe(QuoteStatus.DRAFT);
      expect(Number(quote.totalAmount)).toBe(100.0);
      expect(Number(quote.taxAmount)).toBe(20.0);
      expect(Number(quote.totalWithTax)).toBe(120.0);
      expect(quote.validUntil).toEqual(new Date('2024-12-31T23:59:59.000Z'));
      expect(quote.createdAt).toEqual(new Date('2024-08-15T10:30:00.000Z'));
      expect(quote.updatedAt).toEqual(new Date('2024-08-15T10:30:00.000Z'));
    });

    it('should create quote entity with optional fields', () => {
      const quote = new Quote();
      quote.id = 1;
      quote.number = 'QUO-2024-001';
      quote.customerId = 123;
      quote.customerName = 'Test Customer';
      quote.customerEmail = 'test@example.com';
      quote.status = QuoteStatus.SENT;
      quote.totalAmount = 100.0;
      quote.taxAmount = 20.0;
      quote.totalWithTax = 120.0;
      quote.validUntil = new Date('2024-12-31T23:59:59.000Z');
      quote.createdAt = new Date('2024-08-15T10:30:00.000Z');
      quote.updatedAt = new Date('2024-08-15T10:30:00.000Z');
      quote.deletedAt = new Date('2024-08-16T10:30:00.000Z');

      expect(quote.customerId).toBe(123);
      expect(quote.customerEmail).toBe('test@example.com');
      expect(quote.deletedAt).toEqual(new Date('2024-08-16T10:30:00.000Z'));
    });

    it('should handle all quote statuses', () => {
      const quote = new Quote();

      quote.status = QuoteStatus.DRAFT;
      expect(quote.status).toBe(QuoteStatus.DRAFT);

      quote.status = QuoteStatus.SENT;
      expect(quote.status).toBe(QuoteStatus.SENT);

      quote.status = QuoteStatus.ACCEPTED;
      expect(quote.status).toBe(QuoteStatus.ACCEPTED);

      quote.status = QuoteStatus.REJECTED;
      expect(quote.status).toBe(QuoteStatus.REJECTED);

      quote.status = QuoteStatus.EXPIRED;
      expect(quote.status).toBe(QuoteStatus.EXPIRED);
    });

    it('should handle undefined optional fields', () => {
      const quote = new Quote();
      quote.id = 1;
      quote.number = 'QUO-2024-001';
      quote.customerName = 'Test Customer';
      quote.status = QuoteStatus.DRAFT;
      quote.totalAmount = 100.0;
      quote.taxAmount = 20.0;
      quote.totalWithTax = 120.0;
      quote.validUntil = new Date('2024-12-31T23:59:59.000Z');
      quote.createdAt = new Date('2024-08-15T10:30:00.000Z');
      quote.updatedAt = new Date('2024-08-15T10:30:00.000Z');

      expect(quote.customerId).toBeUndefined();
      expect(quote.customerEmail).toBeUndefined();
      expect(quote.deletedAt).toBeUndefined();
    });

    it('should handle null optional fields', () => {
      const quote = new Quote();
      quote.id = 1;
      quote.number = 'QUO-2024-001';
      quote.customerId = undefined;
      quote.customerName = 'Test Customer';
      quote.customerEmail = undefined;
      quote.status = QuoteStatus.DRAFT;
      quote.totalAmount = 100.0;
      quote.taxAmount = 20.0;
      quote.totalWithTax = 120.0;
      quote.validUntil = new Date('2024-12-31T23:59:59.000Z');
      quote.createdAt = new Date('2024-08-15T10:30:00.000Z');
      quote.updatedAt = new Date('2024-08-15T10:30:00.000Z');
      quote.deletedAt = undefined;

      console.log(quote);

      expect(quote.customerId).toBeUndefined();
      expect(quote.customerEmail).toBeUndefined();
      expect(quote.deletedAt).toBeUndefined();
    });
  });
});
