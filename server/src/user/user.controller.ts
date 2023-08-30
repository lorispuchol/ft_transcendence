import { Body, Controller, Get, Param, Patch, Post, Request, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { Public } from "src/auth/constants";
import { User } from "./user.entity";
import { newUsername } from "./user.dto";
import { newAvatar } from "./user.dto";
import { profile } from "console";

@Controller('user')
export class UserController {
	constructor(
		private userService: UserService
	) {}
	

	@Get('me')
	async getMeData(
		@Request() req: any
		) {
		return await this.userService.findOneByLogin(req.user.login);
	}

	@Patch('username')
	async changeUsername(
		@Request() req: any,
		@Body() newUsername: newUsername
	) {
		this.userService.changeUsername(req.user.id, newUsername.username);
		return {username: newUsername.username};
	}

	@Patch('avatar')
	async changeAvatar(
		@Request() req: any,
		@Body() newAvatar: newAvatar
	) {
		this.userService.changeAvatar(req.user.id, newAvatar.avatar);
		return {avatar: newAvatar.avatar};
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

	// @Post('setAvatar')
    // @UseInterceptors(FileInterceptor('file', storage))
	// async uploadAvatar(
	// 	@Request() req: any,
    //     @UploadedFile() file: any
    // ){
	// 	console.log(storage.storage.filename.filename)
    //     // return this.userService.uploadAvatar(file, await this.userService.findOneByUsername(req.user.login))
    // }

	@Get(':username')
	async getUserData(
		@Param('username') username: string
		) {
			return await this.userService.findOneByUsername(username);
	}
}