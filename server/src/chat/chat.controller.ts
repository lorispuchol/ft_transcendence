import { Body, Controller, Get, Param, Post, Request } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { UserService } from "src/user/user.service";
import { NewChannelWithPassword, NewChannelWithoutPassword } from "./channel.dto";

@Controller('chat')
export class ChatController {
	constructor (
		private chatService: ChatService,
		private userService: UserService
	) {}

	@Get('getConvs')
	async getConvs( @Request() req: any ) {
		return this.chatService.getConvs(
			await this.userService.findOneByLogin(req.user.login)
		)
	}

	@Post('createChan')
	async createChan( 
		@Body() datasChan: NewChannelWithoutPassword
	) {
		// return (await this.authService.createUserWithPassword(user.username, user.password));
	}

	@Post('createChanWithPw')
	async createChanWithPw( 
		@Body() datasChan: NewChannelWithPassword
	) {
		// return (await this.authService.createUserWithPassword(user.username, user.password));
	}

	@Get('getMembers/:chan')
	async GetMembers( 
		@Param('chan') chan: string) {
			return await this.chatService.getAllMembers(chan);
	}

	@Get('getDm/:receiver')
	async getDm(
		@Request() req: any,
		@Param('receiver') receiver: string) {
			return this.chatService.getDm(
				await this.userService.findOneByLogin(req.user.login),
				await this.userService.findOneByLogin(receiver))
	}

	@Get('getMessages/:chan')
	async getMessages(
		@Request() req: any,
		@Param('chan') chan: string
	) {
		return this.chatService.getMessages(req.user.login, chan)
	}
}