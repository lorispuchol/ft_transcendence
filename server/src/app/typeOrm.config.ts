import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
import { User } from "../user/user.entity";
import { Relationship } from "../relationship/relationship.entity";
import { Message } from "src/chat/message.entity";
import { Channel } from "src/chat/channel.entity";
import { Participant } from "src/chat/participant_chan_x_user";
import { Match } from "src/game/match.entity";


export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
	name: 'lorisforever',
	useFactory: (configService: ConfigService) => ({
		type: 'postgres',
		host: configService.get('DB_HOST'),
		port: configService.get<number>('DB_PORT'),
		username: configService.get('DB_USERNAME'),
		password: configService.get('DB_PASSWORD'),
		database: configService.get('DB_NAME'),
		entities: [User, Relationship, Message, Channel, Participant, Match],
		synchronize: true, //dev only
	}),
	inject: [ConfigService]
}