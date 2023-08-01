import { Controller, Get, Param, Request } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { UserService } from "src/user/user.service";

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

	@Get('getDm/:receiver')
	async getDm(
		@Request() req: any,
		@Param('receiver') receiver: string) {
			return this.chatService.getDm(
				await this.userService.findOneByLogin(req.user.login),
				await this.userService.findOneByLogin(receiver))
		}
}