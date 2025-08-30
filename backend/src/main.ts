import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation globale
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

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

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
  console.error("Erreur lors du démarrage de l'application:", err);
  process.exit(1);
});
