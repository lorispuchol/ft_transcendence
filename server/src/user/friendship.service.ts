import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Friendship, FriendshipStatus } from "./friendship.entity";
import { Repository } from "typeorm";
import { User } from "./user.entity";


@Injectable()
export class FriendshipService{
	constructor(
		@InjectRepository(Friendship, 'lorisforever')
		private friendshipRepository: Repository<Friendship>,
	) {}
	async askFriendship(requester: User, recipient: User): Promise< Friendship | undefined > {
		
		const status: string = FriendshipStatus.INVITED;
		return this.friendshipRepository.create({requester, recipient, status});
		// return await this.friendshipRepository.save(newFriendship);
	}

	/// dev
	async getAllFriendship() {
		return this.friendshipRepository.find();
	}
}

