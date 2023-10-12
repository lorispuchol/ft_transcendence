import { Module } from "@nestjs/common";
import { EventGateway } from "./event.gateway";
import { EventService } from "./event.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { Relationship } from "src/relationship/relationship.entity";
import { UserModule } from "src/user/user.module";
import { Participant } from "src/chat/entities/participant_chan_x_user.entity";

@Module({
	imports: [
		TypeOrmModule.forFeature([User, Relationship, Participant], 'lorisforever'),
		UserModule,
	],
	providers: [EventService, EventGateway],
	exports: [EventService],
})
export class EventModule {}
