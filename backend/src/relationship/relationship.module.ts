import { Module } from "@nestjs/common";
import { Relationship } from "./relationship.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RelationshipController } from "./relationship.controller";
import { RelationshipService } from "./relationship.service";
import { UserModule } from "src/user/user.module";
import { EventModule } from "src/event/event.module";


@Module({
	imports: [
		TypeOrmModule.forFeature([Relationship], 'lorisforever'),
		UserModule,
		EventModule
	],
	controllers: [RelationshipController],
	providers: [RelationshipService],
	exports: [RelationshipService]
})
export class RelationshipModule {}
