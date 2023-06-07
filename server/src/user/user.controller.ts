import { Body, Controller, Get, Request } from "@nestjs/common";
import { FriendshipService } from "./friendship.service";
import { User } from "./user.entity";

@Controller('user')
export class UserController {
	constructor(private readonly friendshipService: FriendshipService) {}

	@Get('auth')
	

	@Get('askFriend')
	askFriend(
		@Request() req: any,
		@Body('recipient') recipient: User
	) {
		// return this.friendshipService.askFriendship(req.user, recipient)
	}
}
