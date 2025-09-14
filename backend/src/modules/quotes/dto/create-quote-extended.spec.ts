import { plainToClass } from 'class-transformer';
import { CreateQuoteDto } from './create-quote.dto';

describe('CreateQuoteDto Extended Validation', () => {
  describe('customerId transformation', () => {
    it('should convert string customerId to number', () => {
      const dto = plainToClass(CreateQuoteDto, {
        customerId: '123',
        customerName: 'Test Customer',
        validUntil: '2024-12-31T23:59:59.000Z',
        lines: [
          {
            itemId: 1,
            itemCode: 'TEST001',
            itemName: 'Test Item',
            quantity: 1,
            unitPrice: 10,
          },
        ],
      });

      expect(dto.customerId).toBe(123);
    });

    it('should return null for invalid string customerId', () => {
      const dto = plainToClass(CreateQuoteDto, {
        customerId: 'invalid',
        customerName: 'Test Customer',
        validUntil: '2024-12-31T23:59:59.000Z',
        lines: [
          {
            itemId: 1,
            itemCode: 'TEST001',
            itemName: 'Test Item',
            quantity: 1,
            unitPrice: 10,
          },
        ],
      });

      expect(dto.customerId).toBeNull();
    });

    it('should keep number customerId as is', () => {
      const dto = plainToClass(CreateQuoteDto, {
        customerId: 123,
        customerName: 'Test Customer',
        validUntil: '2024-12-31T23:59:59.000Z',
        lines: [
          {
            itemId: 1,
            itemCode: 'TEST001',
            itemName: 'Test Item',
            quantity: 1,
            unitPrice: 10,
          },
        ],
      });

      expect(dto.customerId).toBe(123);
    });

    it('should keep null customerId as null', () => {
      const dto = plainToClass(CreateQuoteDto, {
        customerId: null,
        customerName: 'Test Customer',
        validUntil: '2024-12-31T23:59:59.000Z',
        lines: [
          {
            itemId: 1,
            itemCode: 'TEST001',
            itemName: 'Test Item',
            quantity: 1,
            unitPrice: 10,
          },
        ],
      });

      expect(dto.customerId).toBeNull();
    });

    it('should handle undefined customerId', () => {
      const dto = plainToClass(CreateQuoteDto, {
        customerName: 'Test Customer',
        validUntil: '2024-12-31T23:59:59.000Z',
        lines: [
          {
            itemId: 1,
            itemCode: 'TEST001',
            itemName: 'Test Item',
            quantity: 1,
            unitPrice: 10,
          },
        ],
      });

      expect(dto.customerId).toBeUndefined();
    });
  });

  describe('customerName transformation', () => {
    it('should trim customerName spaces', () => {
      const dto = plainToClass(CreateQuoteDto, {
        customerName: '  Test Customer  ',
        validUntil: '2024-12-31T23:59:59.000Z',
        lines: [
          {
            itemId: 1,
            itemCode: 'TEST001',
            itemName: 'Test Item',
            quantity: 1,
            unitPrice: 10,
          },
        ],
      });

      expect(dto.customerName).toBe('Test Customer');
    });

    it('should keep null customerName as null', () => {
      const dto = plainToClass(CreateQuoteDto, {
        customerName: null,
        validUntil: '2024-12-31T23:59:59.000Z',
        lines: [
          {
            itemId: 1,
            itemCode: 'TEST001',
            itemName: 'Test Item',
            quantity: 1,
            unitPrice: 10,
          },
        ],
      });

      expect(dto.customerName).toBeNull();
    });
  });

  describe('customerEmail transformation', () => {
    it('should trim customerEmail spaces', () => {
      const dto = plainToClass(CreateQuoteDto, {
        customerName: 'Test Customer',
        customerEmail: '  test@example.com  ',
        validUntil: '2024-12-31T23:59:59.000Z',
        lines: [
          {
            itemId: 1,
            itemCode: 'TEST001',
            itemName: 'Test Item',
            quantity: 1,
            unitPrice: 10,
          },
        ],
      });

      expect(dto.customerEmail).toBe('test@example.com');
    });

    it('should convert empty customerEmail to null', () => {
      const dto = plainToClass(CreateQuoteDto, {
        customerName: 'Test Customer',
        customerEmail: '   ',
        validUntil: '2024-12-31T23:59:59.000Z',
        lines: [
          {
            itemId: 1,
            itemCode: 'TEST001',
            itemName: 'Test Item',
            quantity: 1,
            unitPrice: 10,
          },
        ],
      });

      expect(dto.customerEmail).toBeNull();
    });

    it('should convert undefined customerEmail to null', () => {
      const dto = plainToClass(CreateQuoteDto, {
        customerName: 'Test Customer',
        customerEmail: undefined,
        validUntil: '2024-12-31T23:59:59.000Z',
        lines: [
          {
            itemId: 1,
            itemCode: 'TEST001',
            itemName: 'Test Item',
            quantity: 1,
            unitPrice: 10,
          },
        ],
      });

      expect(dto.customerEmail).toBeNull();
    });
  });

  describe('all transformations combined', () => {
    it('should apply all transformations correctly', () => {
      const dto = plainToClass(CreateQuoteDto, {
        customerId: '456',
        customerName: '  ACME Corporation  ',
        customerEmail: '  contact@acme.com  ',
        validUntil: '2024-12-31T23:59:59.000Z',
        lines: [
          {
            itemId: '1',
            itemCode: '  TEST001  ',
            itemName: '  Test Item  ',
            quantity: '2.5',
            unitPrice: '15.99',
          },
        ],
      });

      expect(dto.customerId).toBe(456);
      expect(dto.customerName).toBe('ACME Corporation');
      expect(dto.customerEmail).toBe('contact@acme.com');
      expect(dto.lines[0].itemId).toBe(1);
      expect(dto.lines[0].itemCode).toBe('TEST001');
      expect(dto.lines[0].itemName).toBe('Test Item');
      expect(dto.lines[0].quantity).toBe(2.5);
      expect(dto.lines[0].unitPrice).toBe(15.99);
    });
  });
});
