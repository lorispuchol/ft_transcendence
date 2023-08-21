import { Body, Controller, Get, Param, Patch, Post, Request, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { Public } from "src/auth/constants";
import { User } from "./user.entity";
// import { FileInterceptor } from "@nestjs/platform-express";

// import { diskStorage } from "multer";
// import { randomUUID } from 'crypto';
// import Path = require('path');

// const storage = {
// 	storage : diskStorage({
// 		destination: 'src/uploads/files',
// 		filename: (req, file, cb) =>{
// 			const filename: string = 'myfile-' + randomUUID();
// 			const extension: string = Path.parse(file.originalname).ext;
// 			cb(null, `${filename}${extension}`)
// 		}
// 	})
// }

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
		@Body('username') newUsername: string
		) {
		const status = await this.userService.changeUsername(req.user.id, newUsername);
		const user =  await this.userService.findOneById(req.user.id);
		return {status: status, user: user};
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