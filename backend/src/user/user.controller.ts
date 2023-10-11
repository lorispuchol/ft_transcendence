import { Body, Controller, Get, Param, Patch, Request, UploadedFile, UseInterceptors,} from "@nestjs/common";
import { UserService } from "./user.service";
import { Public } from "src/auth/constants";
import { User } from "./user.entity";
import { newUsername } from "./user.dto";

import { randomUUID } from "crypto";
import { diskStorage } from "multer";
import Path = require('path');
import { FileInterceptor } from "@nestjs/platform-express";
import * as fs from 'fs';

const	storage = {
	storage: diskStorage ({
		destination: 'public/',
		filename: (req: any, file: any, cb: any) => {
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
		const user: User = await this.userService.findOneByLogin(req.user.login);
		if (!user)
			return ;
		return (this.userService.parseUser(user));
	}

	@Get('all')
	async getAllUsers() {
		const users = await this.userService.getAllUsers();
		return (users);
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
	) {
		const user = await this.userService.findOneByLogin(req.user.login);
		if (!user)
			return ;
		var filename = user.avatar;
		if (filename)
		{
			const i = filename.indexOf('m');
			filename = filename.substring(i);
			fs.unlink('public//' + filename, (err) => {
				if (err) {
					console.error(err);
					return err;
			}})
		}
		this.userService.changeAvatar(req.user.id, file.filename);
		return {file};
	}

	@Get('avatar/:username')
	async getAvatar(
		@Param('username') username: string
	) {
		return await this.userService.getAvatar(username);
	}

	@Get('profile/username/:username')
	async getUserDataByUsername(
		@Param('username') username: string
	) {
		const user: User = await this.userService.findOneByUsername(username);
		if (!user)
			return ;
		return (this.userService.parseUser(user));
	}

	@Get('profile/id/:id')
	async getUserDataById(
		@Param('id') userId: number
	) {
		const user: User = await this.userService.findOneById(userId);
		if (!user)
			return ;
		return (this.userService.parseUser(user));
	}
}

	