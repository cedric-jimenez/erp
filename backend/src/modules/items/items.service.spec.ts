import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ItemsService } from './items.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ItemFactory } from './test/item.factory';
import {
  createMockPrismaService,
  expectItemStructure,
  expectPaginationStructure,
} from './test/test-helpers';
import { UpdateItemDto } from './dto/update-item.dto';

describe('ItemsService', () => {
  let service: ItemsService;
  let mockPrisma: any;

  beforeEach(async () => {
    mockPrisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new item successfully', async () => {
      // Arrange
      const createDto = ItemFactory.createDto();
      const expectedItem = ItemFactory.create({ ...createDto, id: 1 });
      mockPrisma.item.create.mockResolvedValue(expectedItem);

      // Act
      const result = await service.create(createDto);

      // Assert
      expect(mockPrisma.item.create).toHaveBeenCalledWith({
        data: {
          code: createDto.code,
          name: createDto.name,
          description: createDto.description || null,
          unit: createDto.unit || 'unité',
          category: createDto.category || null,
          stockMin: createDto.stockMin || 0,
          active: createDto.active ?? true,
        },
      });
      expectItemStructure(result);
      expect(result.code).toBe(createDto.code);
      expect(result.name).toBe(createDto.name);
    });

    it('should create item with default values', async () => {
      // Arrange
      const createDto = ItemFactory.createDto({
        unit: undefined,
        stockMin: undefined,
        active: undefined,
      });
      const expectedItem = ItemFactory.create();
      mockPrisma.item.create.mockResolvedValue(expectedItem);

      // Act
      await service.create(createDto);

      // Assert
      expect(mockPrisma.item.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          unit: 'unité',
          stockMin: 0,
          active: true,
        }),
      });
    });

    it('should throw ConflictException when code already exists', async () => {
      // Arrange
      const createDto = ItemFactory.createDto({ code: 'DUPLICATE' });

      // Create a proper Prisma error mock using Prisma.PrismaClientKnownRequestError
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed on the fields: (`code`)',
        {
          code: 'P2002',
          clientVersion: '5.0.0',
        },
      );

      mockPrisma.item.create.mockRejectedValue(prismaError);

      // Act & Assert
      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.create(createDto)).rejects.toThrow(
        'Un article avec le code "DUPLICATE" existe déjà',
      );
    });

    it('should rethrow other Prisma errors', async () => {
      // Arrange
      const createDto = ItemFactory.createDto();
      const unexpectedError = new Error('Database connection error');
      mockPrisma.item.create.mockRejectedValue(unexpectedError);

      // Act & Assert
      await expect(service.create(createDto)).rejects.toThrow(
        'Database connection error',
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated items with default parameters', async () => {
      // Arrange
      const testItems = ItemFactory.createMany(3);
      mockPrisma.item.findMany.mockResolvedValue(testItems);
      mockPrisma.item.count.mockResolvedValue(3);

      // Act
      const result = await service.findAll({});

      // Assert
      expectPaginationStructure(result);
      expect(result.data).toHaveLength(3);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(20);
      expect(result.pagination.total).toBe(3);
      expect(mockPrisma.item.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null },
        skip: 0,
        take: 20,
        orderBy: [{ active: 'desc' }, { code: 'asc' }],
      });
    });

    it('should apply search filter correctly', async () => {
      // Arrange
      const testItems = ItemFactory.createMany(2);
      mockPrisma.item.findMany.mockResolvedValue(testItems);
      mockPrisma.item.count.mockResolvedValue(2);

      // Act
      await service.findAll({ search: 'USB', page: 1, limit: 10 });

      // Assert
      expect(mockPrisma.item.findMany).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
          OR: [
            { name: { contains: 'USB', mode: 'insensitive' } },
            { code: { contains: 'USB', mode: 'insensitive' } },
          ],
        },
        skip: 0,
        take: 10,
        orderBy: [{ active: 'desc' }, { code: 'asc' }],
      });
    });

    it('should apply category filter correctly', async () => {
      // Arrange
      const testItems = ItemFactory.createByCategory('Informatique');
      mockPrisma.item.findMany.mockResolvedValue(testItems);
      mockPrisma.item.count.mockResolvedValue(3);

      // Act
      await service.findAll({ category: 'Informatique' });

      // Assert
      expect(mockPrisma.item.findMany).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
          category: { equals: 'Informatique', mode: 'insensitive' },
        },
        skip: 0,
        take: 20,
        orderBy: [{ active: 'desc' }, { code: 'asc' }],
      });
    });

    it('should apply active filter correctly', async () => {
      // Arrange
      const activeItems = ItemFactory.createMany(2, { active: true });
      mockPrisma.item.findMany.mockResolvedValue(activeItems);
      mockPrisma.item.count.mockResolvedValue(2);

      // Act
      await service.findAll({ active: true });

      // Assert
      expect(mockPrisma.item.findMany).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
          active: true,
        },
        skip: 0,
        take: 20,
        orderBy: [{ active: 'desc' }, { code: 'asc' }],
      });
    });

    it('should include archived items when requested', async () => {
      // Arrange
      const allItems = [
        ...ItemFactory.createMany(2),
        ...ItemFactory.createMany(1, { deletedAt: new Date() }),
      ];
      mockPrisma.item.findMany.mockResolvedValue(allItems);
      mockPrisma.item.count.mockResolvedValue(3);

      // Act
      await service.findAll({ includeArchived: true });

      // Assert
      expect(mockPrisma.item.findMany).toHaveBeenCalledWith({
        where: { deletedAt: undefined },
        skip: 0,
        take: 20,
        orderBy: [{ active: 'desc' }, { code: 'asc' }],
      });
    });

    it('should calculate pagination correctly', async () => {
      // Arrange
      const testItems = ItemFactory.createMany(5);
      mockPrisma.item.findMany.mockResolvedValue(testItems.slice(2, 4));
      mockPrisma.item.count.mockResolvedValue(25);

      // Act
      const result = await service.findAll({ page: 2, limit: 2 });

      // Assert
      expect(mockPrisma.item.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null },
        skip: 2,
        take: 2,
        orderBy: [{ active: 'desc' }, { code: 'asc' }],
      });
      expect(result.pagination).toEqual({
        page: 2,
        limit: 2,
        total: 25,
        totalPages: 13,
        hasNext: true,
        hasPrevious: true,
      });
    });
  });

  describe('findOne', () => {
    it('should return an item when found', async () => {
      // Arrange
      const testItem = ItemFactory.create({ id: 1 });
      mockPrisma.item.findFirst.mockResolvedValue(testItem);

      // Act
      const result = await service.findOne(1);

      // Assert
      expectItemStructure(result);
      expect(result.id).toBe(1);
      expect(mockPrisma.item.findFirst).toHaveBeenCalledWith({
        where: {
          id: 1,
          deletedAt: null,
        },
      });
    });

    it('should throw NotFoundException when item not found', async () => {
      // Arrange
      mockPrisma.item.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        "Article avec l'ID 999 non trouvé",
      );
    });
  });

  describe('update', () => {
    it('should update an item successfully', async () => {
      // Arrange
      const existingItem = ItemFactory.create({ id: 1 });
      const updateDto = { name: 'Updated Name', stockMin: 15 };
      const updatedItem = {
        ...existingItem,
        ...updateDto,
        updatedAt: new Date(),
      };

      mockPrisma.item.findFirst.mockResolvedValue(existingItem);
      mockPrisma.item.update.mockResolvedValue(updatedItem);

      // Act
      const result = await service.update(1, updateDto);

      // Assert
      expect(result.name).toBe('Updated Name');
      expect(result.stockMin).toBe(15);
      expect(mockPrisma.item.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          name: 'Updated Name',
          stockMin: 15,
        },
      });
    });

    it('should handle null values correctly', async () => {
      // Arrange
      const existingItem = ItemFactory.create({ id: 1 });
      const updateDto = {
        description: null,
        category: null,
      } as unknown as UpdateItemDto;
      const updatedItem = { ...existingItem, ...updateDto };

      mockPrisma.item.findFirst.mockResolvedValue(existingItem);
      mockPrisma.item.update.mockResolvedValue(updatedItem);

      // Act
      await service.update(1, updateDto);

      // Assert
      expect(mockPrisma.item.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          description: null,
          category: null,
        },
      });
    });

    it('should throw NotFoundException for non-existent item', async () => {
      // Arrange
      mockPrisma.item.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(999, { name: 'Test' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException for duplicate code', async () => {
      // Arrange
      const existingItem = ItemFactory.create({ id: 1 });
      const updateDto = { code: 'DUPLICATE' };

      // Create a proper Prisma error mock using Prisma.PrismaClientKnownRequestError
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed on the fields: (`code`)',
        {
          code: 'P2002',
          clientVersion: '5.0.0',
        },
      );

      mockPrisma.item.findFirst.mockResolvedValue(existingItem);
      mockPrisma.item.update.mockRejectedValue(prismaError);

      // Act & Assert
      await expect(service.update(1, updateDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw original error for non-Prisma errors', async () => {
      // Arrange
      const existingItem = ItemFactory.create({ id: 1 });
      const updateDto = { name: 'Test' };
      const genericError = new Error('Database connection failed');

      mockPrisma.item.findFirst.mockResolvedValue(existingItem);
      mockPrisma.item.update.mockRejectedValue(genericError);

      // Act & Assert
      await expect(service.update(1, updateDto)).rejects.toThrow(
        'Database connection failed',
      );
    });
  });

  describe('remove', () => {
    it('should soft delete an item successfully', async () => {
      // Arrange
      const existingItem = ItemFactory.create({ id: 1 });
      const archivedItem = {
        ...existingItem,
        deletedAt: new Date(),
        active: false,
      };

      mockPrisma.item.findFirst.mockResolvedValue(existingItem);
      mockPrisma.item.update.mockResolvedValue(archivedItem);

      // Act
      const result = await service.remove(1);

      // Assert
      expect(result.active).toBe(false);
      expect(result.deletedAt).toBeTruthy();
      expect(mockPrisma.item.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          deletedAt: expect.any(Date),
          active: false,
        },
      });
    });

    it('should throw NotFoundException for non-existent item', async () => {
      // Arrange
      mockPrisma.item.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('restore', () => {
    it('should restore an archived item successfully', async () => {
      // Arrange
      const archivedItem = ItemFactory.create({
        id: 1,
        deletedAt: new Date(),
        active: false,
      });
      const restoredItem = { ...archivedItem, deletedAt: null, active: true };

      mockPrisma.item.findUnique.mockResolvedValue(archivedItem);
      mockPrisma.item.update.mockResolvedValue(restoredItem);

      // Act
      const result = await service.restore(1);

      // Assert
      expect(result.active).toBe(true);
      expect(result.deletedAt).toBeNull();
      expect(mockPrisma.item.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          deletedAt: null,
          active: true,
        },
      });
    });

    it('should throw NotFoundException for non-existent item', async () => {
      // Arrange
      mockPrisma.item.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.restore(999)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException for non-archived item', async () => {
      // Arrange
      const activeItem = ItemFactory.create({ id: 1, deletedAt: null });
      mockPrisma.item.findUnique.mockResolvedValue(activeItem);

      // Act & Assert
      await expect(service.restore(1)).rejects.toThrow(ConflictException);
      await expect(service.restore(1)).rejects.toThrow(
        "L'article avec l'ID 1 n'est pas archivé",
      );
    });
  });

  describe('checkCodeExists', () => {
    it('should return true when code exists', async () => {
      // Arrange
      const existingItem = ItemFactory.create({ code: 'EXISTING' });
      mockPrisma.item.findFirst.mockResolvedValue(existingItem);

      // Act
      const result = await service.checkCodeExists('EXISTING');

      // Assert
      expect(result).toBe(true);
      expect(mockPrisma.item.findFirst).toHaveBeenCalledWith({
        where: {
          code: { equals: 'EXISTING', mode: 'insensitive' },
          deletedAt: null,
        },
      });
    });

    it('should return false when code does not exist', async () => {
      // Arrange
      mockPrisma.item.findFirst.mockResolvedValue(null);

      // Act
      const result = await service.checkCodeExists('NEW_CODE');

      // Assert
      expect(result).toBe(false);
    });

    it('should exclude specified ID from check', async () => {
      // Arrange
      mockPrisma.item.findFirst.mockResolvedValue(null);

      // Act
      await service.checkCodeExists('EXISTING', 5);

      // Assert
      expect(mockPrisma.item.findFirst).toHaveBeenCalledWith({
        where: {
          code: { equals: 'EXISTING', mode: 'insensitive' },
          deletedAt: null,
          id: { not: 5 },
        },
      });
    });
  });
});
