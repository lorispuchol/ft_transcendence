import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Relationship } from "../relationship/relationship.entity";
import { RelationshipService } from "../relationship/relationship.service";


@Module({
	imports: [TypeOrmModule.forFeature([User, Relationship], 'lorisforever')],
	controllers: [UserController],
	providers: [UserService, RelationshipService],
	exports: [UserService],
})

export class UserModule {}
