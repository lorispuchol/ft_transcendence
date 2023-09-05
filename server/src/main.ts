import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AuthGard } from './auth/auth.guard';
import { client_url } from './auth/constants';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.enableCors({
	origin: [client_url]
  })
  app.useGlobalGuards(new AuthGard());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(8080);
}
bootstrap();
