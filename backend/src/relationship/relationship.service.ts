import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Relationship, RelationshipStatus } from "./relationship.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { User } from "../user/user.entity";
import { EventService } from "src/event/event.service";



@Injectable()
export class RelationshipService{
	constructor(
		@InjectRepository(Relationship, 'lorisforever')
		private relationshipRepository: Repository<Relationship>,
		private	eventService: EventService,
	) {}
	
	async invite(requester: User, recipient: User): Promise<any> {
		
		if (!requester)
			return ({status: "KO", description: "Request impossible"})
		if (!recipient)
			return ({status: "KO", description: "User not found"})
		if (requester.login === recipient.login)
			return ({status: "KO", description: "Impossible to invite yourself"})


		const relation = await this.getRelationship(requester, recipient);
		const reverseRelation = await this.getRelationship(recipient, requester);

		if ((reverseRelation && reverseRelation.status === RelationshipStatus.ACCEPTED) 
			|| (relation && relation.status === RelationshipStatus.ACCEPTED))
			return ({status: "KO", description: `You are already friend with ${recipient.username}`})
		
		if (relation && relation.status === RelationshipStatus.INVITED)
			return ({status: "KO", description: `You already invited ${recipient.username}, waiting for response`})

		if (reverseRelation && reverseRelation.status === RelationshipStatus.INVITED)
			return ({status: "KO", description: `${recipient.username} already invited you, waiting your response`})
			
		if (await this.ReqIsBlocked(requester, recipient))
			return ({status: "KO", description: `${recipient.username} blocked you`})
		
		// if status === blocked  --> it change it
		this.saveRelationship(requester, recipient, RelationshipStatus.INVITED);
		this.eventService.newEvent(recipient.id, {type: "friendRequest", sender: requester.username, senderId: requester.id})
		return ({status: "OK", description: `Invitation send to ${recipient.username}`})
	}

	async accept(acceptor: User, inviter: User) {

		if (!acceptor)
			return ({status: "KO", description: "Request impossible"})
		if (!inviter)
			return ({status: "KO", description: "User not found"})

		const relation = await this.getRelationship (inviter, acceptor);
		const reverseRelation = await this.getRelationship (acceptor, inviter);

		
		if (!relation)
			return ({status: "KO", description: `${inviter.username} didn't invited you or cancelled it`});
		
		if ((reverseRelation && reverseRelation.status === RelationshipStatus.ACCEPTED) 
			|| (relation && relation.status === RelationshipStatus.ACCEPTED))
			return ({status: "KO", description: `You are already friend with ${inviter.username}`});
		
		
		if (relation && relation.status === RelationshipStatus.BLOCKED)
			return ({status: "KO", description: `${inviter.username} blocked you`});
		
		if (reverseRelation && reverseRelation.status === RelationshipStatus.INVITED)
			return ({status: "KO", description: `You invited ${inviter.username}, waiting for response`});
		
		relation.status = RelationshipStatus.ACCEPTED
		await this.relationshipRepository.save(relation);
		this.eventService.deleteEvent(acceptor.id, {type: "friendRequest", sender: inviter.username, senderId: inviter.id});
		return ({status: "OK", description: `You accepted ${inviter.username} as friend`})
	}

	async refuse(refusor: User, inviter: User) {

		if (!refusor)
			return ({status: "KO", description: "Request impossible"})
		if (!inviter)
			return ({status: "KO", description: "User not found"})

		const relation = await this.getRelationship (inviter, refusor);

		if (!relation)
			return ({status: "KO", description: `${inviter.username} didn't invited you or cancelled it`});

		if (relation.status !== RelationshipStatus.INVITED)
			return ({status: "KO", description: `Impossible to refuse ${inviter.username}`});
		this.deleteRelationship(inviter, refusor);
		this.eventService.deleteEvent(refusor.id, {type: "friendRequest", sender: inviter.username, senderId: inviter.id});
		return ({status: "OK", description: `Invitation from ${inviter.username} has been refused`})
	}

	async block(requester: User, recipient: User) {

		if (!requester)
			return ({status: "KO", description: "Request impossible"})
		if (!recipient)
			return ({status: "KO", description: "User not found"})
		
		if (requester.login === recipient.login)
			return ({status: "KO", description: "Impossible to block yourself"})


		const relation = await this.getRelationship(requester, recipient);
		const reverseRelation = await this.getRelationship(recipient, requester);

		if (reverseRelation && reverseRelation.status !== RelationshipStatus.BLOCKED)
			this.deleteRelationship(recipient, requester);

		if (!relation) {
			this.saveRelationship(requester, recipient, RelationshipStatus.BLOCKED);
			return ({status: "OK", description: `You successfully blocked ${recipient.username}`})
		}
		
		if (relation && relation.status == RelationshipStatus.BLOCKED)
			return ({status: "OK", description: `You have already blocked ${recipient.username}`})
			
		relation.status = RelationshipStatus.BLOCKED

		await this.relationshipRepository.save(relation);
		this.eventService.deleteEvent(recipient.id, {type: "friendRequest", sender: requester.username, senderId: requester.id});
		this.eventService.deleteEvent(requester.id, {type: "friendRequest", sender: recipient.username, senderId: requester.id});
		return ({status: "OK", description: `You successfully blocked ${recipient.username}`})

	}

	async unblock(requester: User, recipient: User) {
		
		if (!requester)
			return ({status: "KO", description: "Request impossible"})
		if (!recipient)
			return ({status: "KO", description: "User not found"})
		
		const relation = await this.getRelationship(requester, recipient);
		if (!relation || relation.status !== RelationshipStatus.BLOCKED)
			return ({status: "KO", description: `Impossible to unblock ${recipient.username}`})

		this.deleteRelationship(requester, recipient);
		return ({status: "OK", description: `You successfully unblocked ${recipient.username}`})

	}

	async removeInvitation(requester: User, recipient: User) {
		
		if (!requester)
			return ({status: "KO", description: "Request impossible"})
		if (!recipient)
			return ({status: "KO", description: "User not found"})

		const relation = await this.getRelationship(requester, recipient);
		if (!relation || relation.status !== RelationshipStatus.INVITED)
			return ({status: "KO", description: `Impossible to remove invitation to ${recipient.username}`})
		
		this.deleteRelationship(requester, recipient);
		this.eventService.deleteEvent(recipient.id, {type: "friendRequest", sender: requester.username, senderId: requester.id});
		return ({status: "OK", description: `Invitation to ${recipient.username} has been removed`})
	}


	async removeFriend(requester: User, recipient: User) {
		
		if (!requester)
			return ({status: "KO", description: "Request impossible"})
		if (!recipient)
			return ({status: "KO", description: "User not found"})
		
		const relation: Relationship = await this.getRelationship(requester, recipient);
		const reverseRelation: Relationship = await this.getRelationship(recipient, requester);
		
		if (relation && relation.status === RelationshipStatus.ACCEPTED) {
			this.deleteRelationship(requester, recipient)
			return ({status: "OK", description: `You are no longer friend with ${recipient.username}` })
		}
		if (reverseRelation && reverseRelation.status === RelationshipStatus.ACCEPTED) {
			this.deleteRelationship(recipient, requester)
			return ({status: "OK", description: `You are no longer friend with ${recipient.username}` })
		}
		return ({status: "KO", description: `impossible: You are not friend with ${recipient.username}` })
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
				requester: user1.id,
				recipient: user2.id
			} as FindOptionsWhere<User>
		});
		
		return relation;
	}

	async getRelation(user1: User, user2: User) {

		if (!user1)
			return ({status: "KO", description: "Request impossible"})
		if (!user2)
			return ({status: "KO", description: "User not found"})

		const relation1: Relationship = await this.getRelationship(user1, user2);
		if (relation1 && relation1.status === RelationshipStatus.BLOCKED)
			return ({status: "blocked"});
		
		const relation2: Relationship = await this.getRelationship(user2, user1);
		if (relation2 && relation2.status === RelationshipStatus.BLOCKED)
			return ({status: "blockedYou"});
		
		if (relation1)
			return ({status: relation1.status});
		if (relation2 && relation2.status === RelationshipStatus.ACCEPTED)
			return ({status: relation2.status});
		return ({status: "noRelation", userId: user2.id});
	}

	async saveRelationship(requester: User, recipient: User, status: string) {
		
		const newRelationship: Relationship = new Relationship();
		
		newRelationship.requester = requester;
		newRelationship.recipient = recipient;
		newRelationship.status = status;

		return await this.relationshipRepository.save(newRelationship);
	}

	async ReqIsBlocked(requester: User, recipient: User) {

		const relation: Relationship = await this.getRelationship(recipient, requester)
		if (relation && relation.status === RelationshipStatus.BLOCKED)
			return true;
		return false;
	}

}
