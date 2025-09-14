import { Test, TestingModule } from '@nestjs/testing';
import { QuotesController } from './quotes.controller';
import { QuotesService } from './quotes.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('QuotesModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    const mockPrismaService = {
      $connect: jest.fn(),
      $disconnect: jest.fn(),
    };

    module = await Test.createTestingModule({
      controllers: [QuotesController],
      providers: [
        QuotesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide QuotesController', () => {
    const controller = module.get<QuotesController>(QuotesController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(QuotesController);
  });

  it('should provide QuotesService', () => {
    const service = module.get<QuotesService>(QuotesService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(QuotesService);
  });

  it('should export QuotesService', () => {
    // Verify that the service can be imported by other modules
    expect(() => module.get<QuotesService>(QuotesService)).not.toThrow();
  });
});
