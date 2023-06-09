
import { Body, Controller, Get, Param, Post, Request } from "@nestjs/common";
import { FriendshipService } from "./friendship.service";
import { UserService } from "./user.service";
import { Public } from "src/auth/constants";
import { User } from "./user.entity";
import { Friendship } from "./friendship.entity";

@Controller('user')
export class UserController {
	constructor(
		private readonly friendshipService: FriendshipService,
		private userService: UserService
	) {}
	
  ////dev
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
 
	// @Public()
	@Get('askFriend/:recipient')
	async askFriend (
		@Request() req: any,
		@Param('recipient') recipientId: number ) {
			const recipient: User = await this.userService.findOneById(recipientId);
			const requester: User = await this.userService.findOneById(req.user.id);
			return this.friendshipService.askFriendship(requester, recipient)
    }

	/// dev
	@Public()
	@Get('allfriendship')
	async getAllFriendship() {
		return await this.friendshipService.getAllFriendship();
	}
}
