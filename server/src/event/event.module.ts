import { Module } from "@nestjs/common";
import { EventGateway } from "./event.gateway";
import { EventService } from "./event.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { Relationship } from "src/relationship/relationship.entity";
import { UserModule } from "src/user/user.module";

@Module({
	imports: [
		TypeOrmModule.forFeature([User, Relationship], 'lorisforever'),
		UserModule,
	],
	providers: [EventGateway, EventService],
	exports: [EventService],
})
export class EventModule {}
