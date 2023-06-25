
import { Body, Controller, Get, Param, Patch, Post, Request } from "@nestjs/common";
import { RelationshipService } from "./relationship.service";
import { UserService } from "./user.service";
import { Public } from "src/auth/constants";
import { User } from "./user.entity";

@Controller('user')
export class UserController {
	constructor(
		private readonly relationshipService: RelationshipService,
		private userService: UserService
	) {}
	
	
	@Get('me')
	async getMeData(
		@Request() req: any
		) {
		return await this.userService.findOneByUsername(req.username);
	}

	@Patch('username')
	async changeUsername(
		@Request() req: any,
		@Body('username') newUsername: string
		) {
		const status = await this.userService.changeUsername(req.user.id, newUsername);
		const user =  await this.userService.findOneById(req.user.id);
		return {status: status, user: user};
	}

  // dev
	@Public()
	@Get('all')
	async getAllUsers() {
		return await this.userService.getAllUsers();
	}

	//dev
	@Public()
	@Get('allfriendship')
	async getAllFriendship() {
		return await this.friendshipService.getAllFriendship();
	}
	
	//dev
	@Public()
	@Get('create/:login')
	createFakeUser(@Param('login') login: string): Promise<User> {
		return this.userService.createOne(login);
	}

	@Get('askFriend/:recipient')
	async friendRequest(
		@Request() req: any,
		@Param('recipient') recipientId: number ) {
			return this.friendshipService.askFriendship (
				await this.userService.findOneById(req.user.id),
				await this.userService.findOneById(recipientId)
			)
	}
 	
	@Get(':username')
	async getUserData(
		@Param('username') username: string
		) {
			return await this.userService.findOneByUsername(username);
	}

}