import { Module } from "@nestjs/common";
import { User } from "src/user/user.entity";
import { Relationship } from "./relationship.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RelationshipController } from "./relationship.controller";
import { RelationshipService } from "./relationship.service";
import { UserService } from "src/user/user.service";


@Module({
	imports: [TypeOrmModule.forFeature([User, Relationship], 'lorisforever')],
	controllers: [RelationshipController],
	providers: [RelationshipService, UserService],
	exports: []
})
export class RelationshipModule {}
