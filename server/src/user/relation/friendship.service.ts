import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Friendship, FriendshipStatus } from "./friendship.entity";
import { Repository } from "typeorm";
import { User } from "../user.entity";


@Injectable()
export class FriendshipService{
	constructor(
		@InjectRepository(Friendship, 'lorisforever')
		private friendshipRepository: Repository<Friendship>,
	) {}
	async askFriendship(requester: User, recipient: User): Promise< Friendship | undefined > {
		
		const newFriendship: Friendship = new Friendship();

		newFriendship.recipient = recipient;
		newFriendship.requester = requester;
		newFriendship.status = FriendshipStatus.INVITED;

		return await this.friendshipRepository.save(newFriendship);
	}

	/// dev
	async getAllFriendship() {
		return this.friendshipRepository.find();
	}
}

