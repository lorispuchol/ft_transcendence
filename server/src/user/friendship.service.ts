import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Friendship } from "./friendship.entity";
import { Repository } from "typeorm";
import { User } from "./user.entity";


@Injectable()
export class FriendshipService{
	constructor(
		@InjectRepository(Friendship, 'lorisforever')
		private friendshipRepository: Repository<Friendship>,
	) {}
	// async askFriendship(requester: User, recipient: User): Promise< Friendship | undefined > {
		
	// 	const newFriendship: Friendship = this.friendshipRepository.create({/* requester, */ recipient});
	// 	return await this.friendshipRepository.save(newFriendship);
	// }
}