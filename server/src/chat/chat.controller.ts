import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { UserService } from "src/user/user.service";
import { Distinction, JoinChannelWithPassword, Mute, NewChannelWithPassword, NewChannelWithoutPassword } from "./channel.dto";

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

	@Get('getNoConvs')
	async getNoConvs( @Request() req: any ) {
		return await this.chatService.getNoConvs(
			await this.userService.findOneByLogin(req.user.login)
		)
	}

	@Post('mute/:chan')
	async mute (
		@Request() req: any,
		@Param('chan') chan: string,
		@Body() muteData: Mute) {
		return await this.chatService.mute(
			await this.userService.findOneByLogin(req.user.login),
			chan,
			muteData.login,
		)
	}

	@Post('setDistinction/:chan')
	async setDistinction (
		@Request() req: any,
		@Param('chan') chan: string,
		@Body() distinctionData: Distinction) {
		return await this.chatService.setDistinction(
			await this.userService.findOneByLogin(req.user.login),
			chan,
			distinctionData.login,
			distinctionData.distinction
		)
	}

	@Post('joinProtectedChan/')
	async joinProtectedChan (
		@Request() req: any,
		@Body() dataJoin: JoinChannelWithPassword) {
		return await this.chatService.joinChan(
			await this.userService.findOneByLogin(req.user.login),
			dataJoin.channelName,
			dataJoin.password
		)
	}

	@Post('joinPubChan/:chan')
	async joinPubChan (
		@Request() req: any,
		@Param('chan') chan: string ) {
		return await this.chatService.joinChan(
			await this.userService.findOneByLogin(req.user.login),
			chan,
			null
		)
	}

	@Patch('acceptChannel/:chan')
	async acceptChannel (
		@Request() req: any,
		@Param('chan') chan: string ) {
		return await this.chatService.acceptChan(
			await this.userService.findOneByLogin(req.user.login),
			chan
		)
	}

	@Delete('refuseChannel/:chan')
	async refuseChannel (
		@Request() req: any,
		@Param('chan') chan: string ) {
		return await this.chatService.refuseChan(
			await this.userService.findOneByLogin(req.user.login),
			chan
		)
	}
	
	@Post('createChanWithoutPw')
	async createChan( 
		@Request() req: any,
		@Body() datasChan: NewChannelWithoutPassword
	) {
		return await this.chatService.createChannel(
			await this.userService.findOneByLogin(req.user.login),
			datasChan.channelName,
			datasChan.mode,
		)
	}

	@Post('createChanWithPw')
	async createChanWithPw(
		@Request() req: any,
		@Body() datasChan: NewChannelWithPassword
	) {
		return await this.chatService.createChannel(
			await this.userService.findOneByLogin(req.user.login),
			datasChan.channelName,
			datasChan.mode,
			datasChan.password
		)
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