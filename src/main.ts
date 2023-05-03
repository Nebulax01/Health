import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(json({ limit: '100mb' }));
  app.use(urlencoded({ extended: true, limit: '100mb' }));
  await app.listen(3000);
}
bootstrap();
