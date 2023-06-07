import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Product } from "./products/product.entity";
import { User } from "./user/user.entity";
import { Friendship } from "./user/friendship.entity";


export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
	name: 'lorisforever',
	useFactory: (configService: ConfigService) => ({
		type: 'postgres',
		host: configService.get('DB_HOST'),
		port: configService.get<number>('DB_PORT'),
		username: configService.get('DB_USERNAME'),
		password: configService.get('DB_PASSWORD'),
		database: configService.get('DB_NAME'),
		entities: [Product, User, Friendship],
		synchronize: true, //dev only
	}),
	inject: [ConfigService]
}
