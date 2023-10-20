import { Controller, Delete, Get, Param, ParseIntPipe, Patch, Request } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { RelationshipService } from "./relationship.service";

@Controller('relationship')
export class RelationshipController {
	constructor(
		private relationshipService: RelationshipService,
		private userService: UserService
	) {}

	@Delete('removeFriend/:recipient') 
	async removeFriend(
		@Request() req: any,
		@Param('recipient', ParseIntPipe) recipientId: number
		) {
			return (this.relationshipService.removeFriend(
				await this.userService.findOneById(req.user.id),
				await this.userService.findOneById(recipientId)
			));
	}

	@Delete('removeInvitation/:recipient') 
	async removeInvitation(
		@Request() req: any,
		@Param('recipient', ParseIntPipe) recipientId: number
		) {
			return (this.relationshipService.removeInvitation(
				await this.userService.findOneById(req.user.id),
				await this.userService.findOneById(recipientId)
			));
	}
	
	@Get('invite/:recipient')
	async inviteSomeone(
		@Request() req: any,
		@Param('recipient', ParseIntPipe) recipientId: number ) {
			return this.relationshipService.invite (
				await this.userService.findOneById(req.user.id),
				await this.userService.findOneById(recipientId)
			)
	}

	@Patch('accept/:user')
	async acceptInvitation(
		@Request() req: any,
		@Param('user', ParseIntPipe) userId: number ) {
			return this.relationshipService.accept (
				await this.userService.findOneById(req.user.id),
				await this.userService.findOneById(userId)
			)
	}

	@Delete('refuse/:user')
	async refuseInvitation(
		@Request() req: any,
		@Param('user', ParseIntPipe) userId: number ) {
			return this.relationshipService.refuse (
				await this.userService.findOneById(req.user.id),
				await this.userService.findOneById(userId)
			)
	}

	@Delete('unblock/:recipient') 
	async unblockSomeone(
		@Request() req: any,
		@Param('recipient', ParseIntPipe) recipientId: number
		) {
			return (this.relationshipService.unblock(
				await this.userService.findOneById(req.user.id),
				await this.userService.findOneById(recipientId)
			));
	}

	@Get('block/:recipient')
	async blockSomeone( 
		@Request() req: any,
		@Param('recipient', ParseIntPipe) recipientId: number ) {
			return this.relationshipService.block (
				await this.userService.findOneById(req.user.id),
				await this.userService.findOneById(recipientId)
			)
	}

	@Get('user/:recipient')
	async getRelation(
		@Request() req: any,
		@Param('recipient', ParseIntPipe) recipientId: number ) {
		return this.relationshipService.getRelation(
			await this.userService.findOneById(req.user.id),
			await this.userService.findOneById(recipientId)
		);
	}
}