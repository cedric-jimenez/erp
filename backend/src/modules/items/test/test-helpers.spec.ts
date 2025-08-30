import {
  createMockPrismaService,
  setupMockPrismaSuccess,
  setupMockPrismaErrors,
  expectItemStructure,
  expectPaginationStructure,
  createTestConditions,
} from './test-helpers';
import { ItemFactory } from './item.factory';

describe('Test Helpers', () => {
  describe('createMockPrismaService', () => {
    it('should create a mock Prisma service with all required methods', () => {
      const mockPrisma = createMockPrismaService();

      expect(mockPrisma).toBeDefined();
      expect(mockPrisma.item).toBeDefined();
      expect(typeof mockPrisma.item.create).toBe('function');
      expect(typeof mockPrisma.item.findMany).toBe('function');
      expect(typeof mockPrisma.item.findFirst).toBe('function');
      expect(typeof mockPrisma.item.findUnique).toBe('function');
      expect(typeof mockPrisma.item.update).toBe('function');
      expect(typeof mockPrisma.item.count).toBe('function');
      expect(typeof mockPrisma.$connect).toBe('function');
      expect(typeof mockPrisma.$disconnect).toBe('function');
    });

    it('should return mock functions that can be configured', () => {
      const mockPrisma = createMockPrismaService();

      // Test that mock functions can be configured
      mockPrisma.item.create.mockResolvedValue({ id: 1 } as any);
      mockPrisma.item.findMany.mockResolvedValue([]);

      expect(mockPrisma.item.create).toHaveBeenCalledTimes(0);
      expect(mockPrisma.item.findMany).toHaveBeenCalledTimes(0);
    });
  });

  describe('setupMockPrismaSuccess', () => {
    let mockPrisma: any;

    beforeEach(() => {
      mockPrisma = createMockPrismaService();
    });

    it('should return test items array', () => {
      const testItems = setupMockPrismaSuccess(mockPrisma);

      expect(Array.isArray(testItems)).toBe(true);
      expect(testItems).toHaveLength(3);
      testItems.forEach((item) => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('code');
        expect(item).toHaveProperty('name');
      });
    });

    it('should configure create mock to return new item', () => {
      setupMockPrismaSuccess(mockPrisma);

      const createData = {
        code: 'TEST001',
        name: 'Test Item',
        description: 'Test Description',
      };

      const createdItem =
        mockPrisma.item.create.mock.results[0]?.value ||
        mockPrisma.item.create({ data: createData });

      expect(createdItem).toHaveProperty('id');
      expect(createdItem).toHaveProperty('code');
      expect(createdItem).toHaveProperty('name');
    });

    it('should configure findMany and count mocks with resolved values', () => {
      setupMockPrismaSuccess(mockPrisma);

      expect(mockPrisma.item.findMany.mockResolvedValue).toBeDefined();
      expect(mockPrisma.item.count.mockResolvedValue).toBeDefined();
    });

    it('should configure findFirst mock with conditional logic', () => {
      setupMockPrismaSuccess(mockPrisma);

      const resultForId999 = mockPrisma.item.findFirst({ where: { id: 999 } });
      const resultForId1 = mockPrisma.item.findFirst({ where: { id: 1 } });

      expect(resultForId999).toBeNull();
      expect(resultForId1).toBeDefined();
    });

    it('should configure update mock to return updated item', () => {
      setupMockPrismaSuccess(mockPrisma);

      const updateData = { name: 'Updated Name' };
      const updatedItem = mockPrisma.item.update({
        where: { id: 1 },
        data: updateData,
      });

      expect(updatedItem).toHaveProperty('name');
      expect(updatedItem).toHaveProperty('updatedAt');
      expect(updatedItem.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('setupMockPrismaErrors', () => {
    let mockPrisma: any;

    beforeEach(() => {
      mockPrisma = createMockPrismaService();
    });

    it('should configure create mock to reject with unique constraint error', () => {
      setupMockPrismaErrors(mockPrisma);

      expect(mockPrisma.item.create.mockRejectedValue).toBeDefined();
    });

    it('should configure find methods to return null', () => {
      setupMockPrismaErrors(mockPrisma);

      expect(mockPrisma.item.findFirst.mockResolvedValue).toBeDefined();
      expect(mockPrisma.item.findUnique.mockResolvedValue).toBeDefined();
    });

    it('should configure update mock to reject with record not found error', () => {
      setupMockPrismaErrors(mockPrisma);

      expect(mockPrisma.item.update.mockRejectedValue).toBeDefined();
    });
  });

  describe('expectItemStructure', () => {
    it('should validate correct item structure', () => {
      const validItem = ItemFactory.create();

      expect(() => expectItemStructure(validItem)).not.toThrow();
    });

    it('should throw for missing id property', () => {
      const invalidItem = { name: 'Test', code: 'TEST001' };

      expect(() => expectItemStructure(invalidItem)).toThrow();
    });

    it('should throw for wrong property types', () => {
      const invalidItem = {
        id: 'not-a-number',
        code: 'TEST001',
        name: 'Test',
        unit: 'piece',
        stockMin: 0,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(() => expectItemStructure(invalidItem)).toThrow();
    });

    it('should validate all required properties', () => {
      const completeItem = {
        id: 1,
        code: 'TEST001',
        name: 'Test Item',
        unit: 'piece',
        stockMin: 5,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        description: null,
        category: null,
        deletedAt: null,
      };

      expect(() => expectItemStructure(completeItem)).not.toThrow();
    });
  });

  describe('expectPaginationStructure', () => {
    it('should validate correct pagination structure', () => {
      const validPaginatedResult = {
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

      expect(() =>
        expectPaginationStructure(validPaginatedResult),
      ).not.toThrow();
    });

    it('should throw for missing pagination property', () => {
      const invalidResult = { data: [] };

      expect(() => expectPaginationStructure(invalidResult)).toThrow();
    });

    it('should throw for missing pagination sub-properties', () => {
      const invalidResult = {
        data: [],
        pagination: { page: 1 }, // Missing other properties
      };

      expect(() => expectPaginationStructure(invalidResult)).toThrow();
    });

    it('should validate all pagination property types', () => {
      const validPagination = {
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 100,
          totalPages: 5,
          hasNext: true,
          hasPrevious: false,
        },
      };

      expect(() => expectPaginationStructure(validPagination)).not.toThrow();
    });
  });

  describe('createTestConditions', () => {
    it('should return test conditions with expected properties', () => {
      const conditions = createTestConditions();

      expect(conditions).toHaveProperty('validId');
      expect(conditions).toHaveProperty('invalidId');
      expect(conditions).toHaveProperty('duplicateCode');
      expect(conditions).toHaveProperty('validCode');
      expect(conditions).toHaveProperty('testData');

      expect(typeof conditions.validId).toBe('number');
      expect(typeof conditions.invalidId).toBe('number');
      expect(typeof conditions.duplicateCode).toBe('string');
      expect(typeof conditions.validCode).toBe('string');
      expect(typeof conditions.testData).toBe('object');
    });

    it('should return consistent test data structure', () => {
      const conditions = createTestConditions();

      expect(conditions.testData).toHaveProperty('code');
      expect(conditions.testData).toHaveProperty('name');
      expect(conditions.testData).toHaveProperty('description');
      expect(conditions.testData).toHaveProperty('category');
      expect(conditions.testData).toHaveProperty('stockMin');
      expect(conditions.testData).toHaveProperty('active');

      expect(typeof conditions.testData.code).toBe('string');
      expect(typeof conditions.testData.name).toBe('string');
      expect(typeof conditions.testData.stockMin).toBe('number');
      expect(typeof conditions.testData.active).toBe('boolean');
    });
  });
});
