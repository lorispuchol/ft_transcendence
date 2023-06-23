
import { Body, Controller, Get, Param, Post, Request } from "@nestjs/common";
import { FriendshipService } from "./friendship.service";
import { UserService } from "./user.service";
import { Public } from "src/auth/constants";
import { User } from "./user.entity";

@Controller('user')
export class UserController {
	constructor(
		private readonly friendshipService: FriendshipService,
		private userService: UserService
	) {}

	@Get('me')
	async getMeData(
		@Request() req: any
	) {
		return await this.userService.findOneByUsername(req.username);
	}

	@Get(':username')
	async getUserData(
		@Param('username') username: string
	) {
		return await this.userService.findOneByUsername(username);
	}

	//dev
	@Public()
	@Get('all')
	async getAllUsers() {
		return await this.userService.getAllUsers();
	}

	//dev
	@Public()
	@Get('create/:login')
	createFakeUser(@Param('login') login: string): Promise<User> {
		return this.userService.createOne(login)
	}
 
	@Get('askFriend/:recipient')
	async friendRequest(
		@Request() req: any,
		@Param('recipient') recipientId: number ) {
			return this.friendshipService.askFriendship (
				await this.userService.findOneById(req.id),
				await this.userService.findOneById(recipientId)
			)
    }

	// dev
	@Public()
	@Get('allfriendship')
	async getAllFriendship() {
		return await this.friendshipService.getAllFriendship();
	}
}
