import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGard } from './auth/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new AuthGard());
  await app.listen(8080);
}
bootstrap();
