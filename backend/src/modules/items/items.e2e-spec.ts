import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request, { Response } from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../prisma/prisma.service';
import { ItemFactory } from './test/item.factory';

// Types pour les réponses API
interface ItemResponse {
  id: number;
  code: string;
  name: string;
  description: string | null;
  unit: string;
  category: string | null;
  stockMin: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

interface ErrorResponse {
  message: string | string[];
  error?: string;
  statusCode: number;
}

interface CodeExistsResponse {
  exists: boolean;
}

describe('Items E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply same validation as main app
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    // Clean up database before each test
    await prisma.item.deleteMany({});
  });

  afterAll(async () => {
    await prisma.item.deleteMany({});
    await prisma.$disconnect();
    await app.close();
  });

  describe('POST /api/v1/items', () => {
    it('should create a new item successfully', async () => {
      // Arrange
      const createDto = ItemFactory.createDto({
        code: 'USB001',
        name: 'Clé USB 16GB',
        description: 'Clé USB haute vitesse',
        category: 'Informatique',
        stockMin: 10,
      });

      // Act
      const response: Response = await request(app.getHttpServer())
        .post('/api/v1/items')
        .send(createDto)
        .expect(201);

      // Assert
      const item = response.body as ItemResponse;
      expect(item).toMatchObject({
        code: createDto.code,
        name: createDto.name,
        description: createDto.description,
        category: createDto.category,
        stockMin: createDto.stockMin,
        active: true,
      });
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('createdAt');
      expect(item).toHaveProperty('updatedAt');
    });

    it('should create item with default values', async () => {
      // Arrange
      const minimalDto = {
        code: 'MIN001',
        name: 'Article minimal',
      };

      // Act
      const response: Response = await request(app.getHttpServer())
        .post('/api/v1/items')
        .send(minimalDto)
        .expect(201);

      // Assert
      const item = response.body as ItemResponse;
      expect(item).toMatchObject({
        code: 'MIN001',
        name: 'Article minimal',
        unit: 'unité',
        stockMin: 0,
        active: true,
      });
      expect(item.description).toBeNull();
      expect(item.category).toBeNull();
    });

    it('should fail with duplicate code', async () => {
      // Arrange
      const itemDto = ItemFactory.createDto({ code: 'DUPLICATE' });
      await request(app.getHttpServer())
        .post('/api/v1/items')
        .send(itemDto)
        .expect(201);

      // Act
      const response: Response = await request(app.getHttpServer())
        .post('/api/v1/items')
        .send(itemDto)
        .expect(409);

      // Assert
      const error = response.body as ErrorResponse;
      expect(error.message).toContain('DUPLICATE');
      expect(error.message).toContain('existe déjà');
    });

    it('should fail with validation errors', async () => {
      // Arrange
      const invalidDto = {
        code: '', // Empty code
        name: '', // Empty name
      };

      // Act
      const response: Response = await request(app.getHttpServer())
        .post('/api/v1/items')
        .send(invalidDto)
        .expect(400);

      // Assert
      const error = response.body as ErrorResponse;
      expect(error.message).toBeDefined();
      expect(error.message).toBeDefined();
    });
  });

  describe('GET /api/v1/items/:id', () => {
    it('should get item by id successfully', async () => {
      // Arrange
      const createDto = ItemFactory.createDto();
      const createResponse: Response = await request(app.getHttpServer())
        .post('/api/v1/items')
        .send(createDto)
        .expect(201);

      const createdItem = createResponse.body as ItemResponse;

      // Act
      const response: Response = await request(app.getHttpServer())
        .get(`/api/v1/items/${createdItem.id}`)
        .expect(200);

      // Assert
      const item = response.body as ItemResponse;
      expect(item.id).toBe(createdItem.id);
      expect(item.code).toBe(createDto.code);
      expect(item.name).toBe(createDto.name);
    });

    it('should return 404 for non-existent id', async () => {
      // Act
      await request(app.getHttpServer()).get('/api/v1/items/99999').expect(404);
    });
  });

  describe('GET /api/v1/items', () => {
    it('should return paginated items', async () => {
      // Arrange
      const items = [
        ItemFactory.createDto({ code: 'ITEM1', name: 'Item 1' }),
        ItemFactory.createDto({ code: 'ITEM2', name: 'Item 2' }),
      ];

      for (const item of items) {
        await request(app.getHttpServer())
          .post('/api/v1/items')
          .send(item)
          .expect(201);
      }

      // Act
      const response: Response = await request(app.getHttpServer())
        .get('/api/v1/items')
        .expect(200);

      // Assert
      const result = response.body as PaginatedResponse<ItemResponse>;
      expect(result.data).toHaveLength(2);
      expect(result.pagination).toBeDefined();
      expect(
        result.data.some((item: ItemResponse) => item.name === 'Item 1'),
      ).toBe(true);
      expect(
        result.data.some((item: ItemResponse) => item.code === 'ITEM2'),
      ).toBe(true);
    });

    it('should filter items by search', async () => {
      // Arrange
      await request(app.getHttpServer())
        .post('/api/v1/items')
        .send(ItemFactory.createDto({ code: 'USB001', name: 'USB Drive' }))
        .expect(201);

      await request(app.getHttpServer())
        .post('/api/v1/items')
        .send(ItemFactory.createDto({ code: 'HD001', name: 'Hard Drive' }))
        .expect(201);

      // Act
      const response: Response = await request(app.getHttpServer())
        .get('/api/v1/items?search=USB')
        .expect(200);

      // Assert
      const result = response.body as PaginatedResponse<ItemResponse>;
      expect(result.data).toHaveLength(1);
      expect(
        result.data.some((item: ItemResponse) => item.name.includes('USB')),
      ).toBe(true);
    });

    it('should filter items by category', async () => {
      // Arrange
      await request(app.getHttpServer())
        .post('/api/v1/items')
        .send(
          ItemFactory.createDto({ code: 'PC001', category: 'Informatique' }),
        )
        .expect(201);

      await request(app.getHttpServer())
        .post('/api/v1/items')
        .send(ItemFactory.createDto({ code: 'CH001', category: 'Mobilier' }))
        .expect(201);

      // Act
      const response: Response = await request(app.getHttpServer())
        .get('/api/v1/items?category=Informatique')
        .expect(200);

      // Assert
      const result = response.body as PaginatedResponse<ItemResponse>;
      expect(result.data).toHaveLength(1);
      expect(result.data[0]?.category).toBe('Informatique');
    });

    it('should filter items by active status', async () => {
      // Arrange
      await request(app.getHttpServer())
        .post('/api/v1/items')
        .send(ItemFactory.createDto({ code: 'ACT001', active: true }))
        .expect(201);

      await request(app.getHttpServer())
        .post('/api/v1/items')
        .send(ItemFactory.createDto({ code: 'INACT001', active: false }))
        .expect(201);

      // Act
      const response: Response = await request(app.getHttpServer())
        .get('/api/v1/items?active=false')
        .expect(200);

      // Assert
      const result = response.body as PaginatedResponse<ItemResponse>;
      expect(result.data).toHaveLength(1);
      expect(result.data[0]?.active).toBe(false);
    });
  });

  describe('PUT /api/v1/items/:id', () => {
    it('should update item successfully', async () => {
      // Arrange
      const createDto = ItemFactory.createDto();
      const createResponse: Response = await request(app.getHttpServer())
        .post('/api/v1/items')
        .send(createDto)
        .expect(201);

      const createdItem = createResponse.body as ItemResponse;
      const updateDto = { name: 'Updated Name', stockMin: 20 };

      // Act
      const response: Response = await request(app.getHttpServer())
        .put(`/api/v1/items/${createdItem.id}`)
        .send(updateDto)
        .expect(200);

      // Assert
      const updatedItem = response.body as ItemResponse;
      expect(updatedItem.name).toBe('Updated Name');
      expect(updatedItem.stockMin).toBe(20);
      expect(new Date(updatedItem.updatedAt).getTime()).toBeGreaterThan(
        new Date(createdItem.updatedAt).getTime(),
      );
    });

    it('should return 404 for non-existent item', async () => {
      // Act
      await request(app.getHttpServer())
        .put('/api/v1/items/99999')
        .send({ name: 'Test' })
        .expect(404);
    });

    it('should fail with duplicate code on update', async () => {
      // Arrange
      await request(app.getHttpServer())
        .post('/api/v1/items')
        .send(ItemFactory.createDto({ code: 'FIRST' }))
        .expect(201);

      const secondResponse: Response = await request(app.getHttpServer())
        .post('/api/v1/items')
        .send(ItemFactory.createDto({ code: 'SECOND' }))
        .expect(201);

      const secondItem = secondResponse.body as ItemResponse;

      // Act
      const updateResponse: Response = await request(app.getHttpServer())
        .put(`/api/v1/items/${secondItem.id}`)
        .send({ code: 'FIRST' })
        .expect(409);

      // Assert
      const error = updateResponse.body as ErrorResponse;
      expect(error.message).toContain('FIRST');
      expect(error.message).toContain('existe déjà');
    });
  });

  describe('DELETE /api/v1/items/:id', () => {
    it('should soft delete item successfully', async () => {
      // Arrange
      const createDto = ItemFactory.createDto();
      const createResponse: Response = await request(app.getHttpServer())
        .post('/api/v1/items')
        .send(createDto)
        .expect(201);

      const createdItem = createResponse.body as ItemResponse;

      // Act
      const response: Response = await request(app.getHttpServer())
        .delete(`/api/v1/items/${createdItem.id}`)
        .expect(200);

      // Assert
      const deletedItem = response.body as ItemResponse;
      expect(deletedItem.deletedAt).not.toBeNull();
      expect(deletedItem.active).toBe(false);

      // Verify item is not returned in regular list
      await request(app.getHttpServer())
        .get(`/api/v1/items/${createdItem.id}`)
        .expect(404);
    });

    it('should return 404 for non-existent item', async () => {
      // Act
      await request(app.getHttpServer())
        .delete('/api/v1/items/99999')
        .expect(404);
    });
  });

  describe('POST /api/v1/items/:id/restore', () => {
    it('should restore deleted item successfully', async () => {
      // Arrange
      const createDto = ItemFactory.createDto();
      const createResponse: Response = await request(app.getHttpServer())
        .post('/api/v1/items')
        .send(createDto)
        .expect(201);

      const createdItem = createResponse.body as ItemResponse;

      // Delete first
      await request(app.getHttpServer())
        .delete(`/api/v1/items/${createdItem.id}`)
        .expect(200);

      // Act
      const response: Response = await request(app.getHttpServer())
        .post(`/api/v1/items/${createdItem.id}/restore`)
        .expect(200);

      // Assert
      const restoredItem = response.body as ItemResponse;
      expect(restoredItem.deletedAt).toBeNull();
      expect(restoredItem.active).toBe(true);

      // Verify item is accessible again
      await request(app.getHttpServer())
        .get(`/api/v1/items/${createdItem.id}`)
        .expect(200);
    });

    it('should return 404 for non-existent item', async () => {
      // Act
      await request(app.getHttpServer())
        .post('/api/v1/items/99999/restore')
        .expect(404);
    });

    it('should return 409 for non-deleted item', async () => {
      // Arrange
      const createDto = ItemFactory.createDto();
      const createResponse: Response = await request(app.getHttpServer())
        .post('/api/v1/items')
        .send(createDto)
        .expect(201);

      const createdItem = createResponse.body as ItemResponse;

      // Act
      await request(app.getHttpServer())
        .post(`/api/v1/items/${createdItem.id}/restore`)
        .expect(409);
    });
  });

  describe('GET /api/v1/items/check-code/:code', () => {
    it('should return true for existing code', async () => {
      // Arrange
      const createDto = ItemFactory.createDto({ code: 'EXISTS001' });
      await request(app.getHttpServer())
        .post('/api/v1/items')
        .send(createDto)
        .expect(201);

      // Act
      const response: Response = await request(app.getHttpServer())
        .get('/api/v1/items/check-code/EXISTS001')
        .expect(200);

      // Assert
      const result = response.body as CodeExistsResponse;
      expect(result.exists).toBe(true);
    });

    it('should return false for non-existing code', async () => {
      // Act
      const response: Response = await request(app.getHttpServer())
        .get('/api/v1/items/check-code/NONEXISTENT')
        .expect(200);

      // Assert
      const result = response.body as CodeExistsResponse;
      expect(result.exists).toBe(false);
    });

    it('should exclude item by id when provided', async () => {
      // Arrange
      const createDto = ItemFactory.createDto({ code: 'TEST001' });
      const createResponse: Response = await request(app.getHttpServer())
        .post('/api/v1/items')
        .send(createDto)
        .expect(201);

      const createdItem = createResponse.body as ItemResponse;

      // Act - Check same code excluding the item itself
      const response: Response = await request(app.getHttpServer())
        .get(`/api/v1/items/check-code/TEST001?excludeId=${createdItem.id}`)
        .expect(200);

      // Assert
      const result = response.body as CodeExistsResponse;
      expect(result.exists).toBe(false);
    });

    it('should return true when checking existing code with different excludeId', async () => {
      // Arrange
      const firstDto = ItemFactory.createDto({ code: 'FIRST001' });
      await request(app.getHttpServer())
        .post('/api/v1/items')
        .send(firstDto)
        .expect(201);

      const secondDto = ItemFactory.createDto({ code: 'SECOND001' });
      const secondResponse: Response = await request(app.getHttpServer())
        .post('/api/v1/items')
        .send(secondDto)
        .expect(201);

      const secondItem = secondResponse.body as ItemResponse;

      // Act - Check first code excluding second item (should still exist)
      const response: Response = await request(app.getHttpServer())
        .get(`/api/v1/items/check-code/FIRST001?excludeId=${secondItem.id}`)
        .expect(200);

      // Assert
      const result = response.body as CodeExistsResponse;
      expect(result.exists).toBe(true);
    });
  });
});
