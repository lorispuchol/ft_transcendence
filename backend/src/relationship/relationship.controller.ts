import { Body, Controller, Delete, Get, Param, Patch, Request } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { RelationshipService } from "./relationship.service";
import { Public } from "src/auth/constants";

@Controller('relationship')
export class RelationshipController {
	constructor(
		private relationshipService: RelationshipService,
		private userService: UserService
	) {}

	@Delete('removeFriend/:recipient') 
	async removeFriend(
		@Request() req: any,
		@Param('recipient') recipient: string
		) {
			return (this.relationshipService.removeFriend(
				await this.userService.findOneById(req.user.id),
				await this.userService.findOneByLogin(recipient)
			));
	}

	@Delete('removeInvitation/:recipient') 
	async removeInvitation(
		@Request() req: any,
		@Param('recipient') recipient: string
		) {
			return (this.relationshipService.removeInvitation(
				await this.userService.findOneById(req.user.id),
				await this.userService.findOneByLogin(recipient)
			));
	}
	
	@Get('invite/:recipient')
	async inviteSomeone(
		@Request() req: any,
		@Param('recipient') recipient: string ) {
			return this.relationshipService.invite (
				await this.userService.findOneById(req.user.id),
				await this.userService.findOneByLogin(recipient)
			)
	}

	@Patch('accept/:user')
	async acceptInvitation(
		@Request() req: any,
		@Param('user') user: string ) {
			return this.relationshipService.accept (
				await this.userService.findOneById(req.user.id),
				await this.userService.findOneByLogin(user)
			)
	}

	@Delete('refuse/:user')
	async refuseInvitation(
		@Request() req: any,
		@Param('user') user: string ) {
			return this.relationshipService.refuse (
				await this.userService.findOneById(req.user.id),
				await this.userService.findOneByLogin(user)
			)
	}

	@Delete('unblock/:recipient') 
	async unblockSomeone(
		@Request() req: any,
		@Param('recipient') recipient: string
		) {
			return (this.relationshipService.unblock(
				await this.userService.findOneById(req.user.id),
				await this.userService.findOneByLogin(recipient)
			));
	}

	@Get('block/:recipient')
	async blockSomeone( 
		@Request() req: any,
		@Param('recipient') recipient: string ) {
			return this.relationshipService.block (
				await this.userService.findOneById(req.user.id),
				await this.userService.findOneByLogin(recipient)
			)
	}

	@Get('user/:recipient')
	async getRelation(
		@Request() req: any,
		@Param('recipient') recipient: string ) {
		return this.relationshipService.getRelation(
			await this.userService.findOneById(req.user.id),
			await this.userService.findOneByLogin(recipient)
		);
	}

}