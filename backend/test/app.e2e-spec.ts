import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Configure Swagger for testing
    const config = new DocumentBuilder()
      .setTitle('ERP API')
      .setDescription('API pour la gestion ERP - Items, Stock, Vouchers')
      .setVersion('1.0')
      .addTag('items', 'Gestion des articles')
      .addTag('stock', 'Gestion des stocks')
      .addTag('vouchers', 'Gestion des bons')
      .addTag('auth', 'Authentification')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res) => {
        const body = res.body as {
          status: string;
          timestamp: string;
          uptime: number;
        };
        expect(body).toHaveProperty('status', 'ok');
        expect(body).toHaveProperty('timestamp');
        expect(body).toHaveProperty('uptime');
        expect(typeof body.timestamp).toBe('string');
        expect(typeof body.uptime).toBe('number');
        expect(body.uptime).toBeGreaterThanOrEqual(0);
      });
  });

  it('/health (GET) should return valid JSON with correct headers', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        const body = res.body as { timestamp: string };
        const timestamp = new Date(body.timestamp);
        expect(timestamp.toISOString()).toBe(body.timestamp);
      });
  });

  it('/api (GET) should serve Swagger UI', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect('Content-Type', /html/)
      .expect((res) => {
        expect(res.text).toContain('Swagger UI');
        expect(res.text).toContain('swagger-ui');
        expect(res.text).toContain('div id="swagger-ui"');
      });
  });

  it('/api-json (GET) should return OpenAPI specification', () => {
    return request(app.getHttpServer())
      .get('/api-json')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        const body = res.body as {
          openapi: string;
          info: { title: string; version: string };
          paths: Record<string, unknown>;
        };
        expect(body).toHaveProperty('openapi');
        expect(body).toHaveProperty('info');
        expect(body.info).toHaveProperty('title', 'ERP API');
        expect(body.info).toHaveProperty('version', '1.0');
        expect(body).toHaveProperty('paths');
        expect(body.paths).toHaveProperty('/');
        expect(body.paths).toHaveProperty('/health');
      });
  });
});
