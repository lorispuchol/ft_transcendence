import { Body, Controller, Get, Param, Patch, Post, Request, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { Public } from "src/auth/constants";
import { User } from "./user.entity";
import { newUsername } from "./user.dto";
import { newAvatar } from "./user.dto";
import { profile } from "console";

import { randomUUID } from "crypto";
import { diskStorage } from "multer";
import Path = require('path');
import { FileInterceptor } from "@nestjs/platform-express";

const	storage = {
	storage: diskStorage ({
		destination: 'public/',
		filename: (req, file, cb) => {
			const filename: string = 'myfile-' + randomUUID();
			const extension: string = Path.parse(file.originalname).ext;
            cb(null, `${filename}${extension}`)
		}
	})
}

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
	@UseInterceptors(FileInterceptor('file', storage))
	async changeAvatar(
		@Request() req: any,
		@UploadedFile() file:any,
		// @Body() newAvatar: newAvatar
	) {
		// console.log(file);
		this.userService.changeAvatar(req.user.id, file.filename);
		console.log(file)
		return {file};
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