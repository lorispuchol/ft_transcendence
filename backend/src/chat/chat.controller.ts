import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Request } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { UserService } from "src/user/user.service";
import { AddPwChan, ChangeModeChan, Distinction, JoinChannelWithPassword, Mute, NewChannelWithPassword, NewChannelWithoutPassword, RemovePwChannel, SetPasswordChannel } from "./channel.dto";
import { ChanMode } from "./entities/channel.entity";

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

	@Get('leaveChan/:chan')
	async leaveChan(
		@Request() req: any,
		@Param('chan', new DefaultValuePipe("")) chan: string
	) {
		return this.chatService.leaveChan(
			await this.userService.findOneByLogin(req.user.login),
			chan
		)
	}

	@Post('mute/:chan')
	async mute (
		@Request() req: any,
		@Param('chan', new DefaultValuePipe("")) chan: string,
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
		@Param('chan', new DefaultValuePipe("")) chan: string,
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
		@Param('chan', new DefaultValuePipe("")) chan: string ) {
		return await this.chatService.joinChan(
			await this.userService.findOneByLogin(req.user.login),
			chan,
			null
		)
	}

	@Post('changePwChan/:chan')
	async changePwChan (
		@Request() req: any,
		@Param('chan', new DefaultValuePipe("")) chan: string,
		@Body() dataChan: SetPasswordChannel ) {
		return await this.chatService.setPwChan(
			await this.userService.findOneByLogin(req.user.login),
			chan,
			dataChan.newPw
		)
	}

	@Post('addPwChan/:chan')
	async setPwChan (
		@Request() req: any,
		@Param('chan', new DefaultValuePipe("")) chan: string,
		@Body() dataChan: AddPwChan ) {
		return await this.chatService.setPwChan(
			await this.userService.findOneByLogin(req.user.login),
			chan,
			dataChan.newPw
		)
	}

	@Post('removePwChan/:chan')
	async removePwChan (
		@Request() req: any,
		@Param('chan', new DefaultValuePipe("")) chan: string,
		@Body() dataChan: RemovePwChannel ) {
		return await this.chatService.changeModeChan(
			await this.userService.findOneByLogin(req.user.login),
			chan,
			dataChan.mode
		)
	}
	
	@Post('changeModeChan/:chan')
	async changeModeChan (
		@Request() req: any,
		@Param('chan', new DefaultValuePipe("")) chan: string,
		@Body() dataChan: ChangeModeChan) {
		return await this.chatService.changeModeChan(
			await this.userService.findOneByLogin(req.user.login),
			chan,
			dataChan.mode
		)
	}

	@Patch('acceptChannel/:chan')
	async acceptChannel (
		@Request() req: any,
		@Param('chan', new DefaultValuePipe("")) chan: string ) {
		return await this.chatService.acceptChan(
			await this.userService.findOneByLogin(req.user.login),
			chan
		)
	}

	@Delete('refuseChannel/:chan')
	async refuseChannel (
		@Request() req: any,
		@Param('chan', new DefaultValuePipe("")) chan: string ) {
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
		if (datasChan.mode !== ChanMode.PUBLIC && datasChan.mode !== ChanMode.PRIVATE && datasChan.mode)
			return { error: "mode must be one of the following values: public, private" }
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
		if (datasChan.mode !== ChanMode.PROTECTED)
			return { error: "mode must be one of the following values: protected" }
		return await this.chatService.createChannel(
			await this.userService.findOneByLogin(req.user.login),
			datasChan.channelName,
			datasChan.mode,
			datasChan.password
		)
	}

	@Get('getMembers/:chan')
	async GetMembers( 
		@Param('chan', new DefaultValuePipe("")) chan: string) {
			return await this.chatService.getAllMembers(chan);
	}

	@Get('getDm/:receiver')
	async getDm(
		@Request() req: any,
		@Param('receiver', ParseIntPipe) receiverId: number) {
			return this.chatService.getDm(
				await this.userService.findOneById(req.user.id),
				await this.userService.findOneById(receiverId))
	}

	@Get('getMessages/:chan')
	async getMessages(
		@Request() req: any,
		@Param('chan', new DefaultValuePipe("")) chan: string
	) {
		return this.chatService.getMessages(req.user.login, chan)
	}
}