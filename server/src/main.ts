import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGard } from './auth/auth.guard';
import { client_url } from './auth/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
	origin: [client_url]
  })
  app.useGlobalGuards(new AuthGard());
  await app.listen(8080);
}
bootstrap();
