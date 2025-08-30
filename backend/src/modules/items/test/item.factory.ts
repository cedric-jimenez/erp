import { Item } from '@prisma/client';
import { CreateItemDto } from '../dto/create-item.dto';

export class ItemFactory {
  /**
   * Génère un Item complet pour les tests
   */
  static create(overrides?: Partial<Item>): Item {
    const now = new Date();
    const baseItem: Item = {
      id: Math.floor(Math.random() * 1000) + 1,
      code: `ITEM${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')}`,
      name: 'Article de test',
      description: 'Description de test pour article',
      unit: 'unité',
      category: 'Test',
      stockMin: 10,
      active: true,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      ...overrides,
    };
    return baseItem;
  }

  /**
   * Génère un CreateItemDto pour les tests
   */
  static createDto(overrides?: Partial<CreateItemDto>): CreateItemDto {
    return {
      code: `ITEM${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')}`,
      name: 'Article de test',
      description: 'Description de test pour article',
      unit: 'unité',
      category: 'Test',
      stockMin: 10,
      active: true,
      ...overrides,
    };
  }

  /**
   * Génère plusieurs items pour les tests
   */
  static createMany(count: number, overrides?: Partial<Item>): Item[] {
    return Array.from({ length: count }, (_, index) =>
      ItemFactory.create({
        id: index + 1,
        code: `ITEM${(index + 1).toString().padStart(3, '0')}`,
        name: `Article de test ${index + 1}`,
        ...overrides,
      }),
    );
  }

  /**
   * Génère un item archivé pour les tests
   */
  static createArchived(overrides?: Partial<Item>): Item {
    return ItemFactory.create({
      active: false,
      deletedAt: new Date(),
      ...overrides,
    });
  }

  /**
   * Génère des items par catégorie pour les tests
   */
  static createByCategory(category: string, count: number = 3): Item[] {
    return Array.from({ length: count }, (_, index) =>
      ItemFactory.create({
        id: index + 1,
        code: `${category.toUpperCase()}${(index + 1).toString().padStart(3, '0')}`,
        name: `${category} ${index + 1}`,
        category,
      }),
    );
  }

  /**
   * Génère des données de test complètes pour différents scénarios
   */
  static createTestScenario(): {
    activeItems: Item[];
    archivedItems: Item[];
    informatique: Item[];
    fournitures: Item[];
  } {
    return {
      activeItems: ItemFactory.createMany(5),
      archivedItems: [
        ItemFactory.createArchived({
          id: 10,
          code: 'ARCH001',
          name: 'Article archivé 1',
        }),
        ItemFactory.createArchived({
          id: 11,
          code: 'ARCH002',
          name: 'Article archivé 2',
        }),
      ],
      informatique: ItemFactory.createByCategory('Informatique'),
      fournitures: ItemFactory.createByCategory('Fournitures'),
    };
  }
}

/**
 * Helper pour les valeurs de pagination de test
 */
export const TestPagination = {
  default: { page: 1, limit: 20 },
  firstPage: { page: 1, limit: 5 },
  secondPage: { page: 2, limit: 5 },
  largeLimit: { page: 1, limit: 100 },
};

/**
 * Helper pour les cas d'erreur Prisma
 */
export const PrismaErrors = {
  uniqueConstraint: {
    code: 'P2002',
    message: 'Unique constraint failed',
    meta: { target: ['code'] },
  },
  recordNotFound: {
    code: 'P2025',
    message: 'Record not found',
  },
};
