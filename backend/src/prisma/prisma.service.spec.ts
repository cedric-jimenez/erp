import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onModuleInit', () => {
    it('should call $connect on module initialization', async () => {
      // Arrange
      const connectSpy = jest.spyOn(service, '$connect').mockResolvedValue();

      // Act
      await service.onModuleInit();

      // Assert
      expect(connectSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle connection errors gracefully', async () => {
      // Arrange
      const connectionError = new Error('Connection failed');
      jest.spyOn(service, '$connect').mockRejectedValue(connectionError);

      // Act & Assert
      await expect(service.onModuleInit()).rejects.toThrow('Connection failed');
    });
  });

  describe('enableShutdownHooks', () => {
    it('should set up beforeExit process event handler', () => {
      // Arrange
      const mockApp = {
        close: jest.fn().mockResolvedValue(undefined),
      } as unknown as INestApplication;

      const processOnSpy = jest
        .spyOn(process, 'on')
        .mockImplementation(() => process);

      // Act
      service.enableShutdownHooks(mockApp);

      // Assert
      expect(processOnSpy).toHaveBeenCalledWith(
        'beforeExit',
        expect.any(Function),
      );
    });

    it('should call app.close when beforeExit event is triggered', () => {
      // Arrange
      const mockApp = {
        close: jest.fn().mockResolvedValue(undefined),
      } as unknown as INestApplication;

      let beforeExitHandler: () => void;
      jest.spyOn(process, 'on').mockImplementation((event, handler) => {
        if (event === 'beforeExit') {
          beforeExitHandler = handler as () => void;
        }
        return process;
      });

      // Act
      service.enableShutdownHooks(mockApp);
      beforeExitHandler!(); // Trigger the event handler

      // Assert
      expect(mockApp.close).toHaveBeenCalledTimes(1);
    });
  });

  describe('inheritance and instance', () => {
    it('should be an instance of PrismaClient', () => {
      expect(service).toBeDefined();
      expect(typeof service.$connect).toBe('function');
      expect(typeof service.$disconnect).toBe('function');
    });

    it('should implement OnModuleInit interface', () => {
      expect(typeof service.onModuleInit).toBe('function');
    });
  });
});
