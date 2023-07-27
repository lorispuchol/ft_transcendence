import { Controller, Get, Param, Request } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { UserService } from "src/user/user.service";

@Controller('chat')
export class ChatController {
	constructor (
		private chatService: ChatService,
		private userService: UserService
	) {}

	@Get('allDiscuss')
	async getAllDiscuss( @Request() req: any ) {
		return this.chatService.getAllDiscuss(
			await this.userService.findOneByLogin(req.user.login)
		)
	}

	@Get('getMp/:receiver')
	async getMp(
		@Request() req: any,
		@Param('receiver') receiver: string) {
			return this.chatService.getMp(
				await this.userService.findOneByLogin(req.user.login),
				await this.userService.findOneByLogin(receiver))
		}
}