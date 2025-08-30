import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { ItemFactory } from './test/item.factory';
import {
  expectItemStructure,
  expectPaginationStructure,
} from './test/test-helpers';

describe('ItemsController', () => {
  let controller: ItemsController;
  let mockItemsService: jest.Mocked<ItemsService>;

  beforeEach(async () => {
    mockItemsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      restore: jest.fn(),
      checkCodeExists: jest.fn(),
    } as unknown as jest.Mocked<ItemsService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [
        {
          provide: ItemsService,
          useValue: mockItemsService,
        },
      ],
    }).compile();

    controller = module.get<ItemsController>(ItemsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new item successfully', async () => {
      // Arrange
      const createDto = ItemFactory.createDto();
      const expectedItem = ItemFactory.create({ ...createDto, id: 1 });
      mockItemsService.create.mockResolvedValue(expectedItem);

      // Act
      const result = await controller.create(createDto);

      // Assert
      expect(jest.mocked(mockItemsService).create).toHaveBeenCalledWith(
        createDto,
      );
      expectItemStructure(result);
      expect(result.id).toBe(1);
      expect(result.code).toBe(createDto.code);
      expect(result.name).toBe(createDto.name);
    });

    it('should handle ConflictException from service', async () => {
      // Arrange
      const createDto = ItemFactory.createDto({ code: 'DUPLICATE' });
      mockItemsService.create.mockRejectedValue(
        new ConflictException(
          'Un article avec le code "DUPLICATE" existe déjà',
        ),
      );

      // Act & Assert
      await expect(controller.create(createDto)).rejects.toThrow(
        ConflictException,
      );
      expect(jest.mocked(mockItemsService).create).toHaveBeenCalledWith(
        createDto,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated items with default parameters', async () => {
      // Arrange
      const items = ItemFactory.createMany(3);
      const paginatedResponse = {
        data: items,
        pagination: {
          page: 1,
          limit: 20,
          total: 3,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        },
      };
      mockItemsService.findAll.mockResolvedValue(paginatedResponse);

      // Act
      const result = await controller.findAll({});

      // Assert
      expect(jest.mocked(mockItemsService).findAll).toHaveBeenCalledWith({});
      expectPaginationStructure(result);
      expect(result.data).toHaveLength(3);
    });

    it('should pass query parameters to service', async () => {
      // Arrange
      const queryDto = {
        page: 2,
        limit: 5,
        search: 'USB',
        category: 'Informatique',
        active: true,
        includeArchived: false,
      };
      const paginatedResponse = {
        data: [],
        pagination: {
          page: 2,
          limit: 5,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrevious: true,
        },
      };
      mockItemsService.findAll.mockResolvedValue(paginatedResponse);

      // Act
      await controller.findAll(queryDto);

      // Assert
      expect(jest.mocked(mockItemsService).findAll).toHaveBeenCalledWith(
        queryDto,
      );
    });
  });

  describe('checkCode', () => {
    it('should return exists true when code exists', async () => {
      // Arrange
      mockItemsService.checkCodeExists.mockResolvedValue(true);

      // Act
      const result = await controller.checkCode('EXISTING');

      // Assert
      expect(
        jest.mocked(mockItemsService.checkCodeExists),
      ).toHaveBeenCalledWith('EXISTING', undefined);
      expect(result).toEqual({
        exists: true,
        message: 'Le code "EXISTING" est déjà utilisé',
      });
    });

    it('should return exists false when code does not exist', async () => {
      // Arrange
      mockItemsService.checkCodeExists.mockResolvedValue(false);

      // Act
      const result = await controller.checkCode('NEW_CODE');

      // Assert
      expect(
        jest.mocked(mockItemsService.checkCodeExists),
      ).toHaveBeenCalledWith('NEW_CODE', undefined);
      expect(result).toEqual({
        exists: false,
        message: 'Le code "NEW_CODE" est disponible',
      });
    });

    it('should handle excludeId parameter', async () => {
      // Arrange
      mockItemsService.checkCodeExists.mockResolvedValue(false);

      // Act
      await controller.checkCode('EXISTING', '5');

      // Assert
      expect(
        jest.mocked(mockItemsService.checkCodeExists),
      ).toHaveBeenCalledWith('EXISTING', 5);
    });

    it('should handle invalid excludeId parameter', async () => {
      // Arrange
      mockItemsService.checkCodeExists.mockResolvedValue(false);

      // Act
      await controller.checkCode('EXISTING', 'invalid');

      // Assert
      expect(
        jest.mocked(mockItemsService.checkCodeExists),
      ).toHaveBeenCalledWith('EXISTING', NaN);
    });
  });

  describe('findOne', () => {
    it('should return an item when found', async () => {
      // Arrange
      const item = ItemFactory.create({ id: 1 });
      mockItemsService.findOne.mockResolvedValue(item);

      // Act
      const result = await controller.findOne(1);

      // Assert
      expect(jest.mocked(mockItemsService).findOne).toHaveBeenCalledWith(1);
      expectItemStructure(result);
      expect(result.id).toBe(1);
    });

    it('should handle NotFoundException from service', async () => {
      // Arrange
      mockItemsService.findOne.mockRejectedValue(
        new NotFoundException("Article avec l'ID 999 non trouvé"),
      );

      // Act & Assert
      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
      expect(jest.mocked(mockItemsService).findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('update (PUT)', () => {
    it('should update an item successfully', async () => {
      // Arrange
      const updateDto = ItemFactory.createDto({ name: 'Updated Name' });
      const updatedItem = ItemFactory.create({ id: 1, name: 'Updated Name' });
      mockItemsService.update.mockResolvedValue(updatedItem);

      // Act
      const result = await controller.update(1, updateDto);

      // Assert
      expect(jest.mocked(mockItemsService).update).toHaveBeenCalledWith(
        1,
        updateDto,
      );
      expectItemStructure(result);
      expect(result.name).toBe('Updated Name');
    });

    it('should handle NotFoundException from service', async () => {
      // Arrange
      const updateDto = ItemFactory.createDto();
      mockItemsService.update.mockRejectedValue(
        new NotFoundException("Article avec l'ID 999 non trouvé"),
      );

      // Act & Assert
      await expect(controller.update(999, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(jest.mocked(mockItemsService).update).toHaveBeenCalledWith(
        999,
        updateDto,
      );
    });

    it('should handle ConflictException from service', async () => {
      // Arrange
      const updateDto = ItemFactory.createDto({ code: 'DUPLICATE' });
      mockItemsService.update.mockRejectedValue(
        new ConflictException(
          'Un article avec le code "DUPLICATE" existe déjà',
        ),
      );

      // Act & Assert
      await expect(controller.update(1, updateDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('partialUpdate (PATCH)', () => {
    it('should update an item partially', async () => {
      // Arrange
      const partialUpdateDto = { name: 'Partially Updated Name' };
      const updatedItem = ItemFactory.create({
        id: 1,
        name: 'Partially Updated Name',
      });
      mockItemsService.update.mockResolvedValue(updatedItem);

      // Act
      const result = await controller.partialUpdate(1, partialUpdateDto);

      // Assert
      expect(jest.mocked(mockItemsService).update).toHaveBeenCalledWith(
        1,
        partialUpdateDto,
      );
      expectItemStructure(result);
      expect(result.name).toBe('Partially Updated Name');
    });

    it('should handle empty update data', async () => {
      // Arrange
      const emptyUpdateDto = {};
      const unchangedItem = ItemFactory.create({ id: 1 });
      mockItemsService.update.mockResolvedValue(unchangedItem);

      // Act
      const result = await controller.partialUpdate(1, emptyUpdateDto);

      // Assert
      expect(jest.mocked(mockItemsService).update).toHaveBeenCalledWith(
        1,
        emptyUpdateDto,
      );
      expectItemStructure(result);
    });
  });

  describe('remove', () => {
    it('should archive an item successfully', async () => {
      // Arrange
      const archivedItem = ItemFactory.create({
        id: 1,
        active: false,
        deletedAt: new Date(),
      });
      mockItemsService.remove.mockResolvedValue(archivedItem);

      // Act
      const result = await controller.remove(1);

      // Assert
      expect(jest.mocked(mockItemsService).remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined(); // Controller returns void for DELETE with 204
    });

    it('should handle NotFoundException from service', async () => {
      // Arrange
      mockItemsService.remove.mockRejectedValue(
        new NotFoundException("Article avec l'ID 999 non trouvé"),
      );

      // Act & Assert
      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
      expect(jest.mocked(mockItemsService).remove).toHaveBeenCalledWith(999);
    });
  });

  describe('restore', () => {
    it('should restore an archived item successfully', async () => {
      // Arrange
      const restoredItem = ItemFactory.create({
        id: 1,
        active: true,
        deletedAt: null,
      });
      mockItemsService.restore.mockResolvedValue(restoredItem);

      // Act
      const result = await controller.restore(1);

      // Assert
      expect(jest.mocked(mockItemsService).restore).toHaveBeenCalledWith(1);
      expectItemStructure(result);
      expect(result.active).toBe(true);
      expect(result.deletedAt).toBeNull();
    });

    it('should handle NotFoundException from service', async () => {
      // Arrange
      mockItemsService.restore.mockRejectedValue(
        new NotFoundException("Article avec l'ID 999 non trouvé"),
      );

      // Act & Assert
      await expect(controller.restore(999)).rejects.toThrow(NotFoundException);
      expect(jest.mocked(mockItemsService).restore).toHaveBeenCalledWith(999);
    });

    it('should handle ConflictException from service', async () => {
      // Arrange
      mockItemsService.restore.mockRejectedValue(
        new ConflictException("L'article avec l'ID 1 n'est pas archivé"),
      );

      // Act & Assert
      await expect(controller.restore(1)).rejects.toThrow(ConflictException);
      expect(jest.mocked(mockItemsService).restore).toHaveBeenCalledWith(1);
    });
  });

  describe('parameter validation', () => {
    it('should handle valid numeric IDs', async () => {
      // Arrange
      const item = ItemFactory.create({ id: 42 });
      mockItemsService.findOne.mockResolvedValue(item);

      // Act
      const result = await controller.findOne(42);

      // Assert
      expect(jest.mocked(mockItemsService).findOne).toHaveBeenCalledWith(42);
      expect(result.id).toBe(42);
    });

    it('should handle string numeric IDs (ParseIntPipe conversion)', async () => {
      // Note: ParseIntPipe conversion is handled by NestJS framework
      // This test validates that the controller method signature expects numbers
      // Arrange
      const item = ItemFactory.create({ id: 123 });
      mockItemsService.findOne.mockResolvedValue(item);

      // Act
      const result = await controller.findOne(123); // Number, not string

      // Assert
      expect(jest.mocked(mockItemsService).findOne).toHaveBeenCalledWith(123);
      expect(result.id).toBe(123);
    });
  });
});
