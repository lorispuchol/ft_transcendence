import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Relationship } from "../relationship/relationship.entity";


@Module({
	imports: [TypeOrmModule.forFeature([User, Relationship], 'lorisforever')],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})

export class UserModule {}
