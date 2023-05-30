import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Product } from "./products/product.entity";
import { User } from "./user/user.entity";


export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
	name: 'lorisforever',
	useFactory: (configService: ConfigService) => ({
		type: 'postgres',
		host: configService.get('DB_HOST'),
		port: configService.get<number>('DB_PORT'),
		username: configService.get('DB_USERNAME'),
		password: configService.get('DB_PASSWORD'),
		database: configService.get('DB_NAME'),
		entities: [Product, User, ],
		synchronize: true, //dev only
	}),
	inject: [ConfigService]
}
