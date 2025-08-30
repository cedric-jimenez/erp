import { Item } from '@prisma/client';
import { ItemFactory, PrismaErrors } from './item.factory';

/**
 * Crée un mock complet du PrismaService pour les tests
 */
export const createMockPrismaService = () => {
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

  return mockPrisma as any;
};

/**
 * Configure les réponses du mock Prisma pour les scénarios de succès
 */
export const setupMockPrismaSuccess = (mockPrisma: any): Item[] => {
  const testItems = ItemFactory.createMany(3);

  // Mock create - retourne un nouvel item
  mockPrisma.item.create.mockImplementation((args: any) => {
    const data = args.data;
    return ItemFactory.create({
      code: data.code,
      name: data.name,
      description: data.description || null,
      unit: data.unit || 'unité',
      category: data.category || null,
      stockMin: data.stockMin || 0,
      active: data.active ?? true,
      id: Math.floor(Math.random() * 1000) + 100,
    });
  });

  // Mock findMany - retourne liste paginée
  mockPrisma.item.findMany.mockResolvedValue(testItems);
  mockPrisma.item.count.mockResolvedValue(testItems.length);

  // Mock findFirst/findUnique - retourne un item ou null
  mockPrisma.item.findFirst.mockImplementation((args: any) => {
    const where = args?.where;
    if (where?.id === 999) return null;
    if (where?.id === 1) return testItems[0];
    return testItems[0];
  });

  mockPrisma.item.findUnique.mockImplementation((args: any) => {
    const where = args?.where;
    if (where?.id === 999) return null;
    if (where?.id === 1) return testItems[0];
    return testItems[0];
  });

  // Mock update - retourne l'item modifié
  mockPrisma.item.update.mockImplementation((args: any) => {
    const data = args.data;
    const updatedItem: Item = {
      ...testItems[0],
      // Extraire les valeurs des objets Prisma Field Update Operations
      ...(data.code
        ? {
            code: typeof data.code === 'string' ? data.code : testItems[0].code,
          }
        : {}),
      ...(data.name
        ? {
            name: typeof data.name === 'string' ? data.name : testItems[0].name,
          }
        : {}),
      ...(data.description !== undefined
        ? {
            description:
              typeof data.description === 'string'
                ? data.description
                : data.description,
          }
        : {}),
      ...(data.unit
        ? {
            unit: typeof data.unit === 'string' ? data.unit : testItems[0].unit,
          }
        : {}),
      ...(data.category !== undefined
        ? {
            category:
              typeof data.category === 'string' ? data.category : data.category,
          }
        : {}),
      ...(data.stockMin !== undefined
        ? {
            stockMin:
              typeof data.stockMin === 'number'
                ? data.stockMin
                : testItems[0].stockMin,
          }
        : {}),
      ...(data.active !== undefined
        ? {
            active:
              typeof data.active === 'boolean'
                ? data.active
                : testItems[0].active,
          }
        : {}),
      ...(data.deletedAt !== undefined
        ? {
            deletedAt:
              data.deletedAt instanceof Date ? data.deletedAt : data.deletedAt,
          }
        : {}),
      updatedAt: new Date(),
    };
    return updatedItem;
  });

  return testItems;
};

/**
 * Configure les réponses du mock Prisma pour les scénarios d'erreur
 */
export const setupMockPrismaErrors = (mockPrisma: any): void => {
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
export const expectItemStructure = (item: any): void => {
  expect(item).toHaveProperty('id');
  expect(typeof item.id).toBe('number');
  expect(item).toHaveProperty('code');
  expect(typeof item.code).toBe('string');
  expect(item).toHaveProperty('name');
  expect(typeof item.name).toBe('string');
  expect(item).toHaveProperty('unit');
  expect(typeof item.unit).toBe('string');
  expect(item).toHaveProperty('stockMin');
  expect(typeof item.stockMin).toBe('number');
  expect(item).toHaveProperty('active');
  expect(typeof item.active).toBe('boolean');
  expect(item).toHaveProperty('createdAt');
  expect(item.createdAt).toBeInstanceOf(Date);
  expect(item).toHaveProperty('updatedAt');
  expect(item.updatedAt).toBeInstanceOf(Date);
};

/**
 * Fonction d'aide pour tester la structure de pagination
 */
export const expectPaginationStructure = (result: any): void => {
  expect(result).toHaveProperty('pagination');
  const pagination = result.pagination;
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
