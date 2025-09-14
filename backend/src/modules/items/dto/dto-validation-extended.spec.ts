import { plainToClass } from 'class-transformer';
import { CreateItemDto } from './create-item.dto';
import { QueryItemsDto } from './query-items.dto';

describe('Items DTOs Extended Validation', () => {
  describe('CreateItemDto', () => {
    it('$1', () => {
      const dto = plainToClass(CreateItemDto, {
        code: 'TEST001',
        name: 'Test Item',
        stockMin: '10',
      });

      expect(dto.stockMin).toBe(10);
    });

    it('$1', () => {
      const dto = plainToClass(CreateItemDto, {
        code: 'TEST001',
        name: 'Test Item',
        stockMin: 'invalid',
      });

      expect(dto.stockMin).toBe(0);
    });

    it('$1', () => {
      const dto = plainToClass(CreateItemDto, {
        code: 'TEST001',
        name: 'Test Item',
        stockMin: null,
      });

      expect(dto.stockMin).toBe(0);
    });

    it('$1', () => {
      const dto = plainToClass(CreateItemDto, {
        code: 'TEST001',
        name: 'Test Item',
        stockMin: 15,
      });

      expect(dto.stockMin).toBe(15);
    });

    it('$1', () => {
      const dto = plainToClass(CreateItemDto, {
        code: 'TEST001',
        name: 'Test Item',
      });

      expect(dto.stockMin).toBeUndefined();
    });

    it('$1', () => {
      const dto = plainToClass(CreateItemDto, {
        code: 'TEST001',
        name: 'Test Item',
        description: '   ',
      });

      expect(dto.description).toBeNull();
    });

    it('$1', () => {
      const dto = plainToClass(CreateItemDto, {
        code: 'TEST001',
        name: 'Test Item',
        unit: '   ',
      });

      expect(dto.unit).toBe('unité');
    });

    it('$1', () => {
      const dto = plainToClass(CreateItemDto, {
        code: 'TEST001',
        name: 'Test Item',
        category: '   ',
      });

      expect(dto.category).toBeNull();
    });

    it('$1', () => {
      const dto = plainToClass(CreateItemDto, {
        code: '  TEST001  ',
        name: '  Test Item  ',
        description: '  A test item  ',
        unit: '  pcs  ',
        category: '  Test Category  ',
        stockMin: '5',
        active: true,
      });

      expect(dto.code).toBe('TEST001');
      expect(dto.name).toBe('Test Item');
      expect(dto.description).toBe('A test item');
      expect(dto.unit).toBe('pcs');
      expect(dto.category).toBe('Test Category');
      expect(dto.stockMin).toBe(5);
      expect(dto.active).toBe(true);
    });
  });

  describe('QueryItemsDto', () => {
    it('$1', () => {
      const dto = plainToClass(QueryItemsDto, {
        active: 'true',
      });

      expect(dto.active).toBe(true);
    });

    it('$1', () => {
      const dto = plainToClass(QueryItemsDto, {
        active: 'false',
      });

      expect(dto.active).toBe(false);
    });

    it('$1', () => {
      const dto = plainToClass(QueryItemsDto, {
        active: true,
      });

      expect(dto.active).toBe(true);
    });

    it('$1', () => {
      const dto = plainToClass(QueryItemsDto, {
        active: false,
      });

      expect(dto.active).toBe(false);
    });

    it('$1', () => {
      const dto = plainToClass(QueryItemsDto, {
        active: 'invalid',
      });

      expect(dto.active).toBeUndefined();
    });

    it('$1', () => {
      const dto = plainToClass(QueryItemsDto, {
        includeArchived: 'true',
      });

      expect(dto.includeArchived).toBe(true);
    });

    it('$1', () => {
      const dto = plainToClass(QueryItemsDto, {
        includeArchived: 'false',
      });

      expect(dto.includeArchived).toBe(false);
    });

    it('$1', () => {
      const dto = plainToClass(QueryItemsDto, {
        includeArchived: false,
      });

      expect(dto.includeArchived).toBe(false);
    });

    it('$1', () => {
      const dto = plainToClass(QueryItemsDto, {
        includeArchived: true,
      });

      expect(dto.includeArchived).toBe(true);
    });

    it('$1', () => {
      const dto = plainToClass(QueryItemsDto, {
        includeArchived: undefined,
      });

      expect(dto.includeArchived).toBe(false);
    });

    it('$1', () => {
      const dto = plainToClass(QueryItemsDto, {
        includeArchived: null,
      });

      expect(dto.includeArchived).toBe(false);
    });

    it('$1', () => {
      const dto = plainToClass(QueryItemsDto, {
        includeArchived: 'maybe',
      });

      expect(dto.includeArchived).toBe(false);
    });

    it('$1', () => {
      const dto = plainToClass(QueryItemsDto, {
        page: '3',
      });

      expect(dto.page).toBe(3);
    });

    it('$1', () => {
      const dto = plainToClass(QueryItemsDto, {
        page: 'invalid',
      });

      expect(dto.page).toBe(1);
    });

    it('$1', () => {
      const dto = plainToClass(QueryItemsDto, {
        limit: '50',
      });

      expect(dto.limit).toBe(50);
    });

    it('$1', () => {
      const dto = plainToClass(QueryItemsDto, {
        limit: 'invalid',
      });

      expect(dto.limit).toBe(20);
    });

    it('$1', () => {
      const dto = plainToClass(QueryItemsDto, {
        page: '2',
        limit: '50',
        search: '  test  ',
        category: '  Electronics  ',
        active: 'true',
        includeArchived: 'false',
      });

      expect(dto.page).toBe(2);
      expect(dto.limit).toBe(50);
      expect(dto.search).toBe('test');
      expect(dto.category).toBe('Electronics');
      expect(dto.active).toBe(true);
      expect(dto.includeArchived).toBe(false);
    });
  });
});
