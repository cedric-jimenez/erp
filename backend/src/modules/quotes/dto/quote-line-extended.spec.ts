import { plainToClass } from 'class-transformer';
import { QuoteLineDto } from './quote-line.dto';

describe('QuoteLineDto Extended Validation', () => {
  describe('itemId transformation', () => {
    it('$1', () => {
      const dto = plainToClass(QuoteLineDto, {
        itemId: '42',
        itemCode: 'TEST001',
        itemName: 'Test Item',
        quantity: '2',
        unitPrice: '10.50',
      });

      expect(dto.itemId).toBe(42);
    });

    it('$1', () => {
      const dto = plainToClass(QuoteLineDto, {
        itemId: 42,
        itemCode: 'TEST001',
        itemName: 'Test Item',
        quantity: '2',
        unitPrice: '10.50',
      });

      expect(dto.itemId).toBe(42);
    });

    it('$1', () => {
      const dto = plainToClass(QuoteLineDto, {
        itemId: null,
        itemCode: 'TEST001',
        itemName: 'Test Item',
        quantity: '2',
        unitPrice: '10.50',
      });

      expect(dto.itemId).toBeNull();
    });
  });

  describe('itemCode transformation', () => {
    it('$1', () => {
      const dto = plainToClass(QuoteLineDto, {
        itemId: 42,
        itemCode: '  TEST001  ',
        itemName: 'Test Item',
        quantity: '2',
        unitPrice: '10.50',
      });

      expect(dto.itemCode).toBe('TEST001');
    });

    it('$1', () => {
      const dto = plainToClass(QuoteLineDto, {
        itemId: 42,
        itemCode: null,
        itemName: 'Test Item',
        quantity: '2',
        unitPrice: '10.50',
      });

      expect(dto.itemCode).toBeNull();
    });
  });

  describe('itemName transformation', () => {
    it('$1', () => {
      const dto = plainToClass(QuoteLineDto, {
        itemId: 42,
        itemCode: 'TEST001',
        itemName: '  Test Item  ',
        quantity: '2',
        unitPrice: '10.50',
      });

      expect(dto.itemName).toBe('Test Item');
    });

    it('$1', () => {
      const dto = plainToClass(QuoteLineDto, {
        itemId: 42,
        itemCode: 'TEST001',
        itemName: undefined,
        quantity: '2',
        unitPrice: '10.50',
      });

      expect(dto.itemName).toBeUndefined();
    });
  });

  describe('quantity transformation', () => {
    it('$1', () => {
      const dto = plainToClass(QuoteLineDto, {
        itemId: 42,
        itemCode: 'TEST001',
        itemName: 'Test Item',
        quantity: '2.5',
        unitPrice: '10.50',
      });

      expect(dto.quantity).toBe(2.5);
    });

    it('$1', () => {
      const dto = plainToClass(QuoteLineDto, {
        itemId: 42,
        itemCode: 'TEST001',
        itemName: 'Test Item',
        quantity: 2.5,
        unitPrice: '10.50',
      });

      expect(dto.quantity).toBe(2.5);
    });

    it('$1', () => {
      const dto = plainToClass(QuoteLineDto, {
        itemId: 42,
        itemCode: 'TEST001',
        itemName: 'Test Item',
        quantity: null,
        unitPrice: '10.50',
      });

      expect(dto.quantity).toBeNull();
    });
  });

  describe('unitPrice transformation', () => {
    it('$1', () => {
      const dto = plainToClass(QuoteLineDto, {
        itemId: 42,
        itemCode: 'TEST001',
        itemName: 'Test Item',
        quantity: '2',
        unitPrice: '10.50',
      });

      expect(dto.unitPrice).toBe(10.5);
    });

    it('$1', () => {
      const dto = plainToClass(QuoteLineDto, {
        itemId: 42,
        itemCode: 'TEST001',
        itemName: 'Test Item',
        quantity: '2',
        unitPrice: 10.5,
      });

      expect(dto.unitPrice).toBe(10.5);
    });

    it('$1', () => {
      const dto = plainToClass(QuoteLineDto, {
        itemId: 42,
        itemCode: 'TEST001',
        itemName: 'Test Item',
        quantity: '2',
        unitPrice: false,
      });

      expect(dto.unitPrice).toBe(false);
    });
  });

  describe('all transformations combined', () => {
    it('$1', () => {
      const dto = plainToClass(QuoteLineDto, {
        itemId: '42',
        itemCode: '  TEST001  ',
        itemName: '  Test Item  ',
        quantity: '2.500',
        unitPrice: '10.99',
      });

      expect(dto.itemId).toBe(42);
      expect(dto.itemCode).toBe('TEST001');
      expect(dto.itemName).toBe('Test Item');
      expect(dto.quantity).toBe(2.5);
      expect(dto.unitPrice).toBe(10.99);
    });
  });
});
