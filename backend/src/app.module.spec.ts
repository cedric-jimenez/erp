import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ItemsModule } from './modules/items/items.module';

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });

  it('should have AppController', () => {
    const controller = module.get<AppController>(AppController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(AppController);
  });

  it('should have AppService', () => {
    const service = module.get<AppService>(AppService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(AppService);
  });

  it('should import PrismaModule', () => {
    expect(() => module.get(PrismaModule)).not.toThrow();
  });

  it('should import ItemsModule', () => {
    expect(() => module.get(ItemsModule)).not.toThrow();
  });

  it('should have all required dependencies injected', () => {
    const controller = module.get<AppController>(AppController);
    const service = module.get<AppService>(AppService);

    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
