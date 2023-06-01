import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './typeOrm.config';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGard } from './auth/auth.guard';

@Module({
	imports: [
		ConfigModule.forRoot({isGlobal: true}),
		TypeOrmModule.forRootAsync(typeOrmConfig),
		ProductsModule,
		AuthModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: AuthGard,
		}
	],
})
export class AppModule {}
