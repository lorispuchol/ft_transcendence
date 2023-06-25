import { Controller, Delete, Get, Param, Patch, Request } from "@nestjs/common";
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

	@Get('ask/:recipient')
	async askFriend(
		@Request() req: any,
		@Param('recipient') recipient: string ) {
			return this.relationshipService.askFriend (
				await this.userService.findOneById(req.user.id),
				await this.userService.findOneByUsername(recipient)
			)
	}

	@Patch('accept/:user')
	async acceptFriend(
		@Request() req: any,
		@Param('recipient') recipient: string ) {
			
	}

	@Get('block/:recipient')
	blockSomeone() {

	}

	@Delete('deleteRelation') 
	deleteRelation() {

	}
}