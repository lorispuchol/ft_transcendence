import { Body, Controller, Get, Param, Patch, Request } from "@nestjs/common";
import { UserService } from "./user.service";
import { Public } from "src/auth/constants";
import { User } from "./user.entity";
import { newUsername } from "./user.dto";

@Controller('user')
export class UserController {
	constructor(
		private userService: UserService
	) {}
	

	@Get('me')
	async getMeData(
		@Request() req: any
		) {
		return await this.userService.findOneByUsername(req.user.login);
	}

	@Patch('username')
	async changeUsername(
		@Request() req: any,
		@Body() newUsername: newUsername
	) {
		this.userService.changeUsername(req.user.id, newUsername.username);
		return {username: newUsername.username};
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
		return this.userService.createOne(login);
	}

	//dev
	@Public()
	@Get('delete/:login')
	deleteFakeUser(@Param('login') login: string) {
		return this.userService.deleteOne(login);
	}

	@Get(':username')
	async getUserData(
		@Param('username') username: string
		) {
			return await this.userService.findOneByUsername(username);
	}
}