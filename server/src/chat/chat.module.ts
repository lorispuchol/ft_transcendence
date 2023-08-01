import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";
import { Participant } from "./entities/participant_chan_x_user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "src/user/user.module";
import { Channel } from "./entities/channel.entity";


@Module({
	imports: [
		UserModule,
		TypeOrmModule.forFeature([Participant, Channel], 'lorisforever'),],
	controllers: [ChatController],
	providers: [ChatGateway, ChatService],
	exports: [ChatService]
})
export class ChatModule {}
