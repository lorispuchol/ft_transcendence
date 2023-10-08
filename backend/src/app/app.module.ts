import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './typeOrm.config';
import { AuthModule } from '../auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGard } from '../auth/auth.guard';
import { RelationshipModule } from '../relationship/relationship.module';
import { ChatModule } from 'src/chat/chat.module';
import { EventModule } from 'src/event/event.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GameModule } from 'src/game/game.module';

@Module({
	imports: [
		ConfigModule.forRoot({isGlobal: true}),
		TypeOrmModule.forRootAsync(typeOrmConfig),
		AuthModule,
		ChatModule,
		RelationshipModule,
		EventModule,
		GameModule,
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', '../../public'),
			serveRoot: '/public/'
		})
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
