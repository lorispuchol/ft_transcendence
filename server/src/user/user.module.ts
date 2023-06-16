import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Friendship } from "./relation/friendship.entity";
import { FriendshipService } from "./relation/friendship.service";


@Module({
	imports: [TypeOrmModule.forFeature([User, Friendship], 'lorisforever')],
	controllers: [UserController],
	providers: [UserService, FriendshipService],
	exports: [UserService],
})

export class UserModule {}
