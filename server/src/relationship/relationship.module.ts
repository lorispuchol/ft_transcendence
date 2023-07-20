import { Module } from "@nestjs/common";
import { User } from "src/user/user.entity";
import { Relationship } from "./relationship.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RelationshipController } from "./relationship.controller";
import { RelationshipService } from "./relationship.service";
import { UserService } from "src/user/user.service";
import { UserModule } from "src/user/user.module";


@Module({
	imports: [
		TypeOrmModule.forFeature([User, Relationship], 'lorisforever'),
		UserModule
	],
	controllers: [RelationshipController],
	providers: [RelationshipService],
	exports: [RelationshipService]
})
export class RelationshipModule {}
