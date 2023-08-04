import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AuthGard } from './auth/auth.guard';
import { client_url } from './auth/constants';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.enableCors({
	origin: [client_url]
  })
  app.useGlobalGuards(new AuthGard());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(8080);
}
bootstrap();
