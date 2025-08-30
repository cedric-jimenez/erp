import { Test, TestingModule } from '@nestjs/testing';
import { ItemsModule } from './items.module';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaModule } from '../../prisma/prisma.module';

// Mock PrismaService pour éviter les connexions DB
const mockPrismaService = {
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
  onModuleInit: jest.fn(),
  enableShutdownHooks: jest.fn(),
};

describe('ItemsModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ItemsModule, PrismaModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
    jest.clearAllMocks();
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });

  it('should have ItemsController', () => {
    const controller = module.get<ItemsController>(ItemsController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(ItemsController);
  });

  it('should have ItemsService', () => {
    const service = module.get<ItemsService>(ItemsService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(ItemsService);
  });

  it('should export ItemsService', () => {
    const service = module.get<ItemsService>(ItemsService);
    expect(service).toBeDefined();
  });

  it('should inject PrismaService into ItemsService', () => {
    const service = module.get<ItemsService>(ItemsService);
    // Le service devrait être défini et fonctionnel
    expect(service).toBeDefined();
    expect(typeof service.create).toBe('function');
    expect(typeof service.findAll).toBe('function');
    expect(typeof service.findOne).toBe('function');
  });

  it('should have proper dependency injection chain', () => {
    const controller = module.get<ItemsController>(ItemsController);
    const service = module.get<ItemsService>(ItemsService);

    // Vérifier que le contrôleur et le service sont correctement injectés
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
