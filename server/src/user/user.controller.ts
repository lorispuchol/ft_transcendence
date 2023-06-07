
import { Body, Controller, Get, Request } from "@nestjs/common";
import { FriendshipService } from "./friendship.service";
import { UserService } from "./user.service";
import { User } from "./user.entity";
import { Public } from "src/auth/constants";

@Controller('user')
export class UserController {
	constructor(private readonly friendshipService: FriendshipService, private userService: UserService) {}
	
  ////dev
	@Public()
	@Get('all')
	async getAllUsers()
	{
		return await this.userService.getAllUsers();
  }
 
	@Get('askFriend')
	askFriend(
		@Request() req: any,
		@Body('recipient') recipient: User
	) {
		// return this.friendshipService.askFriendship(req.user, recipient)
    }
}
