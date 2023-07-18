import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Relationship, RelationshipStatus } from "./relationship.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { User } from "../user/user.entity";



@Injectable()
export class RelationshipService{
	constructor(
		@InjectRepository(Relationship, 'lorisforever')
		private relationshipRepository: Repository<Relationship>,
	) {}
	
	async ask(requester: User, recipient: User): Promise<any> {
				
		const relation = this.getRelationship(requester, recipient);
		if (relation) {
			return "ever asked: Pending response from " + recipient.login
		}

		if (this.isBlockedBy(requester, recipient))
			return "Error: your are blocked by " + recipient.login

		return this.saveRelationship(requester, recipient, RelationshipStatus.INVITED);

	}

	async accept(acceptor: User, requester: User) {

		const relation = await this.getRelationship (acceptor, requester);

		if (!relation)
			return "relation doesn't exists"
		if (relation.status !== RelationshipStatus.INVITED)
			return "impossible to accept this relation"
		else
			relation.status = RelationshipStatus.ACCEPTED

		await this.relationshipRepository.save(relation);
	}

	async refuse(refusor: User, requester: User) {

		const relation = await this.getRelationship (refusor, requester);

		if (!relation)
			return "relation doesn't exists"
		if (relation.status !== RelationshipStatus.INVITED)
			return "impossible to refuse this relation"
		this.deleteRelationship(requester, refusor)
	}

	async block(requester: User, recipient: User) {
		
		const relation: Relationship = await this.getRelationship(requester, recipient);
		const reverseRelation: Relationship = await this.getRelationship(recipient, requester);

		if (reverseRelation && reverseRelation.status !== RelationshipStatus.BLOCKED)
			this.deleteRelationship(recipient, requester);


		if (!relation)
			return this.saveRelationship(requester, recipient, RelationshipStatus.BLOCKED);
			
		relation.status = RelationshipStatus.BLOCKED

		await this.relationshipRepository.save(relation);
	}

	unblock(requester: User, recipient: User) {
		this.deleteRelationship(requester, recipient);
	}

	async removeFriend(requester: User, recipient: User) {
		const relation: Relationship = await this.getRelationship(requester, recipient);
		const reverseRelation: Relationship = await this.getRelationship(recipient, requester);

		if (!relation && !reverseRelation)
			return "You weren't friends"
		
		if (relation && relation.status === RelationshipStatus.ACCEPTED) {
			this.deleteRelationship(requester, recipient)
		}
		if (reverseRelation && reverseRelation.status === RelationshipStatus.ACCEPTED) {
			this.deleteRelationship(recipient, requester)
		}
		return "Your are no longer friends"
	}




	
	/// dev
	async getAllRelationship() {
		return this.relationshipRepository.find();
	}

	async deleteRelationship(user1: User, user2: User) {
		await this.relationshipRepository.delete({
			requester: {id: user1.id},
			recipient: {id: user2.id}
		});
		return "relationship deleted";
	}

	async getRelationship(user1: User, user2: User) {

		const relation: Relationship = await this.relationshipRepository.findOne({
			relations: ["requester", "recipient"],
			where: {
				requester: {id: user1.id},
				recipient:  {id: user2.id}
			} as FindOptionsWhere<User>
		});

		return relation;
	}

	async saveRelationship(requester: User, recipient: User, status: string) {
		
		const newRelationship: Relationship = new Relationship();
		
		newRelationship.requester = requester;
		newRelationship.recipient = recipient;
		newRelationship.status = status;

		return await this.relationshipRepository.save(newRelationship);
	}

	async isBlockedBy(requester: User, recipient: User) {

		const relation: Relationship = await this.getRelationship(recipient, requester)
		if (relation.status === RelationshipStatus.BLOCKED)
			return true;
		return false;
	}
}
