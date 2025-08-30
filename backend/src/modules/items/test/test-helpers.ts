import { Item, Prisma } from '@prisma/client';
import { ItemFactory, PrismaErrors } from './item.factory';

/**
 * Type definition for mock Prisma service used in tests
 */
export interface MockPrismaService {
  item: {
    create: jest.MockedFunction<(args: Prisma.ItemCreateArgs) => Promise<Item>>;
    findMany: jest.MockedFunction<
      (args?: Prisma.ItemFindManyArgs) => Promise<Item[]>
    >;
    findFirst: jest.MockedFunction<
      (args?: Prisma.ItemFindFirstArgs) => Promise<Item | null>
    >;
    findUnique: jest.MockedFunction<
      (args: Prisma.ItemFindUniqueArgs) => Promise<Item | null>
    >;
    update: jest.MockedFunction<(args: Prisma.ItemUpdateArgs) => Promise<Item>>;
    count: jest.MockedFunction<
      (args?: Prisma.ItemCountArgs) => Promise<number>
    >;
  };
  $connect: jest.MockedFunction<() => Promise<void>>;
  $disconnect: jest.MockedFunction<() => Promise<void>>;
}

/**
 * Crée un mock complet du PrismaService pour les tests
 */
export const createMockPrismaService = (): MockPrismaService => {
  const mockPrisma = {
    item: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  };

  return mockPrisma as MockPrismaService;
};

/**
 * Configure les réponses du mock Prisma pour les scénarios de succès
 */
export const setupMockPrismaSuccess = (
  mockPrisma: MockPrismaService,
): Item[] => {
  const testItems = ItemFactory.createMany(3);

  // Mock create - retourne un nouvel item
  mockPrisma.item.create.mockImplementation((args: Prisma.ItemCreateArgs) => {
    const data = args.data;
    return Promise.resolve(
      ItemFactory.create({
        code: data.code,
        name: data.name,
        description: data.description || null,
        unit: data.unit || 'unité',
        category: data.category || null,
        stockMin: data.stockMin || 0,
        active: data.active ?? true,
        id: Math.floor(Math.random() * 1000) + 100,
      }),
    );
  });

  // Mock findMany - retourne liste paginée
  mockPrisma.item.findMany.mockResolvedValue(testItems);
  mockPrisma.item.count.mockResolvedValue(testItems.length);

  // Mock findFirst/findUnique - retourne un item ou null
  mockPrisma.item.findFirst.mockImplementation(
    (args?: Prisma.ItemFindFirstArgs) => {
      const where = args?.where;
      if (where?.id === 999) return Promise.resolve(null);
      if (where?.id === 1) return Promise.resolve(testItems[0]);
      return Promise.resolve(testItems[0]);
    },
  );

  mockPrisma.item.findUnique.mockImplementation(
    (args: Prisma.ItemFindUniqueArgs) => {
      const where = args?.where;
      if (where?.id === 999) return Promise.resolve(null);
      if (where?.id === 1) return Promise.resolve(testItems[0]);
      return Promise.resolve(testItems[0]);
    },
  );

  // Mock update - retourne l'item modifié
  mockPrisma.item.update.mockImplementation((args: Prisma.ItemUpdateArgs) => {
    const data = args.data;

    // Helper function to extract simple values from Prisma update operations
    const extractValue = <T>(
      value: T | { set?: T } | undefined,
      fallback: T,
    ): T => {
      if (value === undefined) return fallback;
      if (typeof value === 'object' && value !== null && 'set' in value) {
        return value.set !== undefined ? value.set : fallback;
      }
      return value as T;
    };

    // Special handler for deletedAt field which can be string, Date, or null
    const extractDateValue = (
      value: string | Date | { set?: string | Date | null } | null | undefined,
      fallback: Date | null,
    ): Date | null => {
      if (value === undefined) return fallback;
      if (typeof value === 'object' && value !== null && 'set' in value) {
        const setValue = value.set;
        if (setValue === undefined || setValue === null) return fallback;
        return typeof setValue === 'string' ? new Date(setValue) : setValue;
      }
      if (value === null) return null;
      return typeof value === 'string' ? new Date(value) : (value as Date);
    };

    const updatedItem: Item = {
      ...testItems[0],
      ...(data.code !== undefined && {
        code: extractValue(data.code, testItems[0].code),
      }),
      ...(data.name !== undefined && {
        name: extractValue(data.name, testItems[0].name),
      }),
      ...(data.description !== undefined && {
        description: extractValue(data.description, testItems[0].description),
      }),
      ...(data.unit !== undefined && {
        unit: extractValue(data.unit, testItems[0].unit),
      }),
      ...(data.category !== undefined && {
        category: extractValue(data.category, testItems[0].category),
      }),
      ...(data.stockMin !== undefined && {
        stockMin: extractValue(data.stockMin, testItems[0].stockMin),
      }),
      ...(data.active !== undefined && {
        active: extractValue(data.active, testItems[0].active),
      }),
      ...(data.deletedAt !== undefined && {
        deletedAt: extractDateValue(data.deletedAt, testItems[0].deletedAt),
      }),
      updatedAt: new Date(),
    };
    return Promise.resolve(updatedItem);
  });

  return testItems;
};

/**
 * Configure les réponses du mock Prisma pour les scénarios d'erreur
 */
export const setupMockPrismaErrors = (mockPrisma: MockPrismaService): void => {
  // Mock create - erreur de conflit (code dupliqué)
  mockPrisma.item.create.mockRejectedValue(PrismaErrors.uniqueConstraint);

  // Mock findFirst/findUnique - aucun résultat
  mockPrisma.item.findFirst.mockResolvedValue(null);
  mockPrisma.item.findUnique.mockResolvedValue(null);

  // Mock update - item non trouvé
  mockPrisma.item.update.mockRejectedValue(PrismaErrors.recordNotFound);
};

/**
 * Fonction d'aide pour tester la structure d'un Item
 */
export const expectItemStructure = (item: unknown): void => {
  expect(item).toEqual(expect.any(Object));
  const itemObj = item as Record<string, unknown>;
  expect(itemObj).toHaveProperty('id');
  expect(typeof itemObj.id).toBe('number');
  expect(itemObj).toHaveProperty('code');
  expect(typeof itemObj.code).toBe('string');
  expect(itemObj).toHaveProperty('name');
  expect(typeof itemObj.name).toBe('string');
  expect(itemObj).toHaveProperty('unit');
  expect(typeof itemObj.unit).toBe('string');
  expect(itemObj).toHaveProperty('stockMin');
  expect(typeof itemObj.stockMin).toBe('number');
  expect(itemObj).toHaveProperty('active');
  expect(typeof itemObj.active).toBe('boolean');
  expect(itemObj).toHaveProperty('createdAt');
  expect(itemObj.createdAt).toBeInstanceOf(Date);
  expect(itemObj).toHaveProperty('updatedAt');
  expect(itemObj.updatedAt).toBeInstanceOf(Date);
};

/**
 * Fonction d'aide pour tester la structure de pagination
 */
export const expectPaginationStructure = (result: unknown): void => {
  expect(result).toEqual(expect.any(Object));
  const resultObj = result as Record<string, unknown>;
  expect(resultObj).toHaveProperty('pagination');
  const pagination = resultObj.pagination as Record<string, unknown>;
  expect(pagination).toHaveProperty('page');
  expect(typeof pagination.page).toBe('number');
  expect(pagination).toHaveProperty('limit');
  expect(typeof pagination.limit).toBe('number');
  expect(pagination).toHaveProperty('total');
  expect(typeof pagination.total).toBe('number');
  expect(pagination).toHaveProperty('totalPages');
  expect(typeof pagination.totalPages).toBe('number');
  expect(pagination).toHaveProperty('hasNext');
  expect(typeof pagination.hasNext).toBe('boolean');
  expect(pagination).toHaveProperty('hasPrevious');
  expect(typeof pagination.hasPrevious).toBe('boolean');
};

/**
 * Helper pour créer des conditions de test standardisées
 */
export const createTestConditions = () => {
  return {
    validId: 1,
    invalidId: 999,
    duplicateCode: 'DUPLICATE_TEST',
    validCode: 'VALID_TEST',
    testData: {
      code: 'TEST001',
      name: 'Test Item',
      description: 'Test Description',
      category: 'Test Category',
      stockMin: 5,
      active: true,
    },
  };
};
