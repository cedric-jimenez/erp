import { Quote } from './quote.entity';
import { QuoteLine } from './quote-line.entity';
import { QuoteStatus } from '@prisma/client';

describe('Quote Entities', () => {
  describe('Quote Entity', () => {
    it('should create a quote entity with all properties', () => {
      const quote = new Quote();
      quote.id = 1;
      quote.number = 'QUO-2024-001';
      quote.customerId = 123;
      quote.customerName = 'Test Client';
      quote.customerEmail = 'test@client.com';
      quote.status = QuoteStatus.DRAFT;
      quote.totalAmount = 1000;
      quote.taxAmount = 200;
      quote.totalWithTax = 1200;
      quote.validUntil = new Date();
      quote.createdAt = new Date();
      quote.updatedAt = new Date();
      quote.deletedAt = undefined;

      expect(quote.id).toBe(1);
      expect(quote.number).toBe('QUO-2024-001');
      expect(quote.customerId).toBe(123);
      expect(quote.customerName).toBe('Test Client');
      expect(quote.status).toBe(QuoteStatus.DRAFT);
    });

    it('should handle optional properties', () => {
      const quote = new Quote();
      quote.id = 1;
      quote.number = 'QUO-2024-001';
      quote.customerName = 'Test Client';
      quote.status = QuoteStatus.DRAFT;
      quote.totalAmount = 1000;
      quote.taxAmount = 200;
      quote.totalWithTax = 1200;
      quote.validUntil = new Date();
      quote.createdAt = new Date();
      quote.updatedAt = new Date();

      expect(quote.customerId).toBeUndefined();
      expect(quote.customerEmail).toBeUndefined();
      expect(quote.deletedAt).toBeUndefined();
    });
  });

  describe('QuoteLine Entity', () => {
    it('should create a quote line entity with all properties', () => {
      const quoteLine = new QuoteLine();
      quoteLine.id = 1;
      quoteLine.quoteId = 1;
      quoteLine.itemId = 42;
      quoteLine.itemCode = 'ITEM001';
      quoteLine.itemName = 'Test Item';
      quoteLine.quantity = 2;
      quoteLine.unitPrice = 500;
      quoteLine.lineTotal = 1000;

      expect(quoteLine.id).toBe(1);
      expect(quoteLine.quoteId).toBe(1);
      expect(quoteLine.itemId).toBe(42);
      expect(quoteLine.itemCode).toBe('ITEM001');
      expect(quoteLine.quantity).toBe(2);
      expect(quoteLine.unitPrice).toBe(500);
      expect(quoteLine.lineTotal).toBe(1000);
    });

    it('should handle decimal calculations', () => {
      const quoteLine = new QuoteLine();
      quoteLine.quantity = 2;
      quoteLine.unitPrice = 99.99;
      quoteLine.lineTotal = quoteLine.quantity * quoteLine.unitPrice;

      expect(quoteLine.lineTotal).toBe(199.98);
    });
  });
});
