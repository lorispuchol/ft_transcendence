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
	
	async askFriend(requesterw: User, recipientw: User): Promise<any> {

		Logger.warn("fffff");
				
		const newRelationship: Relationship = new Relationship();
		
		newRelationship.recipient = recipientw;
		newRelationship.requester = requesterw;
		newRelationship.status = RelationshipStatus.INVITED;

		Logger.warn("fffff");
		const relation = await this.relationshipRepository.find(
			{
				relations: ["requester", "recipient"],
				where: {
					requester: requesterw.id,
					recipient:  recipientw.id
				} as FindOptionsWhere<User>
			});
		// One(
		// 	{
		// 		where: {requester: {id: requesterw.id}, recipient: {id: recipientw.id }},
		// 		relations: {
		// 			requester: {relationships: true},
		// 			recipient: {relationships: true},
				
		// 		}
		// });
		// 	{where:
		// 	{
		// 		requester: {
		// 			id: requesterw.id
		// 		}
		// 	},
		// 	relations: ["requester", "recipient"]
		// }

		// );
		Logger.verbose(relation);

		if (relation) {
			return "tu m'a deja inviter connard"
		}
		return await this.relationshipRepository.save(newRelationship);
	}

	async delete(requester: User, recipient: User) {
		// console.log(requester, recipient);
		await this.relationshipRepository.delete({requester: {id: requester.id}, recipient: {id: recipient.id}});
		return "deleted";
	}

	/// dev
	async getAllRelationship() {
		return this.relationshipRepository.find();
	}

}
