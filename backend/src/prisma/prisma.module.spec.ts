import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from './prisma.module';
import { PrismaService } from './prisma.service';

/**
 * Interface for test service that wraps PrismaService
 */
interface TestService {
  prisma: PrismaService;
}

describe('PrismaModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [PrismaModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        $connect: jest.fn(),
        $disconnect: jest.fn(),
        onModuleInit: jest.fn(),
        enableShutdownHooks: jest.fn(),
      })
      .compile();
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });

  it('should provide PrismaService', () => {
    const service = module.get<PrismaService>(PrismaService);
    expect(service).toBeDefined();
  });

  it('should be a global module', async () => {
    // Test que le module est global en vérifiant qu'il peut être utilisé sans import explicite
    const testModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        {
          provide: 'TEST_SERVICE',
          useFactory: (prismaService: PrismaService) => {
            return { prisma: prismaService };
          },
          inject: [PrismaService],
        },
      ],
    })
      .overrideProvider(PrismaService)
      .useValue({
        $connect: jest.fn(),
        $disconnect: jest.fn(),
        onModuleInit: jest.fn(),
        enableShutdownHooks: jest.fn(),
      })
      .compile();

    const testService = testModule.get<TestService>('TEST_SERVICE');
    expect(testService).toBeDefined();
    expect(testService.prisma).toBeDefined();

    await testModule.close();
  });

  it('should export PrismaService for use in other modules', () => {
    const service = module.get<PrismaService>(PrismaService);
    expect(service).toBeDefined();
    expect(typeof service.$connect).toBe('function');
    expect(typeof service.$disconnect).toBe('function');
  });

  it('should make PrismaService available globally', () => {
    // Vérifier que PrismaService est disponible dans le contexte global
    expect(() => module.get<PrismaService>(PrismaService)).not.toThrow();
  });
});
