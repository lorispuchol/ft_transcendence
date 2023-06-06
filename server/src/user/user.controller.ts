import { Controller, Get } from "@nestjs/common";
import { UserService } from "./user.service";
import { Public } from "src/auth/constants";

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	////dev
	@Public()
	@Get('all')
	async getAllUsers()
	{
		return await this.userService.getAllUsers();
	}
}
