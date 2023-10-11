import { Body, Controller, Delete, Get, Param, Patch, Request, UploadedFile, UseInterceptors,} from "@nestjs/common";
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

// 	@Delete(':fileName')
//  	async deletePicture(@Param('fileName') fileName: string) {
//   	await fs.unlink('${fileName}', (err) => {
// 	if (err) {
//     	console.error(err);
//    		return err;
//    }});
// 	}
	@Get(':username')
	async getUserData(
		@Param('username') username: string
		) {
			return await this.userService.findOneByUsername(username);
		}
	}

// 	@Delete(':fileName')
//  async deletePicture(@Param('fileName') fileName: string) {
//   await fs.unlink('../../uploads/${fileName}', (err) => {
//    if (err) {
//     console.error(err);
//     return err;
//    }
//   });
//  }
	