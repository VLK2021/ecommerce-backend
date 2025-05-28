import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

async function bootstrap() {
  const server = express(); // ⬅️ створення express-серверу
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server)); // ⬅️ адаптер

  // cookie parser
  app.use(cookieParser());

  // глобальний валідаційний пайп
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        return new BadRequestException(
          errors.map((err) => ({
            field: err.property,
            errors: Object.values(err.constraints || {}),
          })),
        );
      },
    }),
  );

  // глобальний фільтр
  app.useGlobalFilters(new AllExceptionsFilter());

  // 🔥 ВКЛЮЧАЄМО CORS для фронту
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  // swagger
  const config = new DocumentBuilder()
    .setTitle('Ecommerce API')
    .setDescription('Документація до API інтернет-магазину')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📘 Swagger available at http://localhost:${port}/api`);
}

bootstrap();
