import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Relationship, RelationshipStatus } from "./relationship.entity";
import { Repository } from "typeorm";
import { User } from "../user/user.entity";


@Injectable()
export class RelationshipService{
	constructor(
		@InjectRepository(Relationship, 'lorisforever')
		private relationshipRepository: Repository<Relationship>,
	) {}
	
	async askRelationship(requester: User, recipient: User): Promise< Relationship | undefined > {
		
		const newRelationship: Relationship = new Relationship();

		newRelationship.recipient = recipient;
		newRelationship.requester = requester;
		newRelationship.status = RelationshipStatus.INVITED;

		return await this.relationshipRepository.save(newRelationship);
	}

	/// dev
	async getAllRelationship() {
		return this.relationshipRepository.find();
	}
}

