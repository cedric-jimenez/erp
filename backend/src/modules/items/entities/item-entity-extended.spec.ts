import { Item } from './item.entity';

describe('Item Entity Extended', () => {
  describe('Item entity structure', () => {
    it('should create item entity with all required fields', () => {
      const item = new Item();
      item.id = 1;
      item.code = 'TEST001';
      item.name = 'Test Item';
      item.unit = 'unité';
      item.stockMin = 0;
      item.active = true;
      item.createdAt = new Date('2024-08-24T10:00:00Z');
      item.updatedAt = new Date('2024-08-24T10:00:00Z');

      expect(item.id).toBe(1);
      expect(item.code).toBe('TEST001');
      expect(item.name).toBe('Test Item');
      expect(item.unit).toBe('unité');
      expect(item.stockMin).toBe(0);
      expect(item.active).toBe(true);
      expect(item.createdAt).toEqual(new Date('2024-08-24T10:00:00Z'));
      expect(item.updatedAt).toEqual(new Date('2024-08-24T10:00:00Z'));
    });

    it('should create item entity with optional fields', () => {
      const item = new Item();
      item.id = 1;
      item.code = 'TEST001';
      item.name = 'Test Item';
      item.description = 'A detailed description';
      item.unit = 'pcs';
      item.category = 'Electronics';
      item.stockMin = 10;
      item.active = true;
      item.createdAt = new Date('2024-08-24T10:00:00Z');
      item.updatedAt = new Date('2024-08-24T10:00:00Z');
      item.deletedAt = new Date('2024-08-25T10:00:00Z');

      expect(item.description).toBe('A detailed description');
      expect(item.category).toBe('Electronics');
      expect(item.stockMin).toBe(10);
      expect(item.deletedAt).toEqual(new Date('2024-08-25T10:00:00Z'));
    });

    it('should handle undefined optional fields', () => {
      const item = new Item();
      item.id = 1;
      item.code = 'TEST001';
      item.name = 'Test Item';
      item.unit = 'unité';
      item.stockMin = 0;
      item.active = true;
      item.createdAt = new Date('2024-08-24T10:00:00Z');
      item.updatedAt = new Date('2024-08-24T10:00:00Z');

      expect(item.description).toBeUndefined();
      expect(item.category).toBeUndefined();
      expect(item.deletedAt).toBeUndefined();
    });

    it('should handle null optional fields', () => {
      const item = new Item();
      item.id = 1;
      item.code = 'TEST001';
      item.name = 'Test Item';
      item.description = null;
      item.unit = 'unité';
      item.category = null;
      item.stockMin = 0;
      item.active = false;
      item.createdAt = new Date('2024-08-24T10:00:00Z');
      item.updatedAt = new Date('2024-08-24T10:00:00Z');
      item.deletedAt = null;

      expect(item.description).toBeNull();
      expect(item.category).toBeNull();
      expect(item.active).toBe(false);
      expect(item.deletedAt).toBeNull();
    });

    it('should handle boolean active field variations', () => {
      const item = new Item();

      item.active = true;
      expect(item.active).toBe(true);

      item.active = false;
      expect(item.active).toBe(false);
    });

    it('should handle different stockMin values', () => {
      const item = new Item();

      item.stockMin = 0;
      expect(item.stockMin).toBe(0);

      item.stockMin = 5;
      expect(item.stockMin).toBe(5);

      item.stockMin = 100;
      expect(item.stockMin).toBe(100);
    });

    it('should handle different unit values', () => {
      const item = new Item();

      item.unit = 'unité';
      expect(item.unit).toBe('unité');

      item.unit = 'pcs';
      expect(item.unit).toBe('pcs');

      item.unit = 'kg';
      expect(item.unit).toBe('kg');

      item.unit = 'litre';
      expect(item.unit).toBe('litre');
    });
  });
});
