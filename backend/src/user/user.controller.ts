import { BadRequestException, Body, Controller, DefaultValuePipe, Get, HttpException, HttpStatus, Param, ParseFilePipe, ParseIntPipe, Patch, Request, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.entity";
import { newUsername } from "./user.dto";

import { randomUUID } from "crypto";
import { diskStorage } from "multer";
import Path = require('path');
import { FileInterceptor } from "@nestjs/platform-express";
import * as fs from 'fs';
import { HttpStatusCode } from "axios";
import Jimp = require("jimp");

const	storage = {
	storage: diskStorage ({
		destination: 'public/',
		filename: (req: any, file: any, cb: any) => {
			const filename: string = 'myfile-' + randomUUID();
			const extension: string = Path.parse(file.originalname).ext;
            cb(null, `${filename}${extension}`)
		}
	}),
    limits: { fileSize: 800000 },
    fileFilter: (req: any, file: any, cb: any) => {
        if (!file.mimetype.match(/image\/(jpg|jpeg|png|gif)$/)) {
            return cb(new BadRequestException('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
}

@Controller('user')
export class UserController {
	constructor(
		private userService: UserService
	) {}
	

	@Get('me')
	async getMeData(@Request() req: any) {
		const user: User = await this.userService.findOneByLogin(req.user.login);
		if (!user)
			throw new HttpException('unauthorized', HttpStatusCode.Unauthorized);
		return (this.userService.parseUser(user));
	}

	@Get('all')
	async getAllUsers(@Request() req: any,) {
		const userId = req.user.id;
		const users = await this.userService.getAllUsers();
		const usersId: number[] = users.map((user: User)  => (user.id)).filter((id) => (id !== userId));
		return (usersId);
	}

	@Patch('username')
	async changeUsername(
		@Request() req: any,
		@Body() newUsername: newUsername
	) {
		const user: User = await this.userService.findOneById(req.user.id);
		if (!user)
			return ;
		this.userService.changeUsername(req.user.id, newUsername.username);
		return {username: newUsername.username};
	}

	@Patch('usernameToLogin')
	async changeUsernameToLogin(@Request() req: any) {
		const user: User = await this.userService.findOneById(req.user.id);
		if (!user)
			return ;
		this.userService.changeUsername(user.id, user.login);
		return {username: user.login};
	}

	@Patch('avatar')
	@UseInterceptors(FileInterceptor('file', storage))
	async changeAvatar(
		@Request() req: any,
		@UploadedFile(ParseFilePipe) file: Express.Multer.File,
	) {
		const user = await this.userService.findOneByLogin(req.user.login);
		if (!user || !file)
			return ;

		let fileError: boolean = false;
		try {
			await Jimp.read(file.path);
		}
		catch (err) {
			fileError = true;
		}
		if (fileError)
			throw new HttpException("Bad file", HttpStatus.FORBIDDEN);
		
		let filename = user.avatar;
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
		return ;
	}

	@Get('on2fa')
	async userOn2fa(@Request() req: any) {
		const user: User = await this.userService.findOneById(req.user.id);
		if (!user || !user.otp_secret)
			return false;
		return true;
	}

	@Get('avatar/:username')
	async getAvatar(@Param('username', new DefaultValuePipe("")) username: string) {
		return await this.userService.getAvatar(username);
	}

	@Get('profile/username/:username')
	async getUserDataByUsername(@Param('username', new DefaultValuePipe("")) username: string) {
		const user: User = await this.userService.findOneByUsername(username);
		if (!user)
			return ;
		return (this.userService.parseUser(user));
	}

	@Get('profile/id/:id')
	async getUserDataById(@Param('id', ParseIntPipe) userId: number) {
		const user: User = await this.userService.findOneById(userId);
		if (!user)
			return ;
		return (this.userService.parseUser(user));
	}

	@Get('friendlist/:id')
	async getFriendlist(@Param('id', ParseIntPipe) userId: number) {
		return (this.userService.getFriendlist(userId));
	}
}
