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

	//dev
	@Public()
	@Get('all')
	async getAllRelationship() {
		return await this.relationshipService.getAllRelationship();
	}

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
	
	@Get('ask/:recipient')
	async askFriend(
		@Request() req: any,
		@Param('recipient') recipient: string ) {
			return this.relationshipService.ask (
				await this.userService.findOneById(req.user.id),
				await this.userService.findOneByUsername(recipient)
			)
	}

	@Patch('accept/:user')
	async acceptFriend(
		@Request() req: any,
		@Param('user') user: string ) {
			return this.relationshipService.accept (
				await this.userService.findOneById(req.user.id),
				await this.userService.findOneByUsername(user)
			)
	}

	@Delete('refuse/:user')
	async refuseFriend(
		@Request() req: any,
		@Param('user') user: string ) {
			return this.relationshipService.refuse (
				await this.userService.findOneById(req.user.id),
				await this.userService.findOneByUsername(user)
			)
	}

	@Delete('unblock/:recipient') 
	async unblockRelation(
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
				await this.userService.findOneByUsername(recipient)
			)
	}
}