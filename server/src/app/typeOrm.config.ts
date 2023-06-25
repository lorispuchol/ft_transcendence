import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
import { User } from "../user/user.entity";
import { Relationship } from "../relationship/relationship.entity";


export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
	name: 'lorisforever',
	useFactory: (configService: ConfigService) => ({
		type: 'postgres',
		host: configService.get('DB_HOST'),
		port: configService.get<number>('DB_PORT'),
		username: configService.get('DB_USERNAME'),
		password: configService.get('DB_PASSWORD'),
		database: configService.get('DB_NAME'),
		entities: [User, Relationship],
		synchronize: true, //dev only
	}),
	inject: [ConfigService]
}