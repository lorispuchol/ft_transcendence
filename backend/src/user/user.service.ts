import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { server_url } from "src/auth/constants";
import { Match } from "src/game/match.entity";
import { RelationshipStatus } from "src/relationship/relationship.entity";
// import { Relationship } from "src/relationship/relationship.entity";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User, 'lorisforever')
			private userRepository: Repository<User>
	){}

	async createOne(login: string, password?: string): Promise<User | undefined> {
		const username: string = login;
		const newUser: User = this.userRepository.create({login, username});
		newUser.password = password;
		return await this.userRepository.save(newUser);
	}
	
	async findOneById(id: number): Promise<User | undefined> {
		return this.userRepository.findOneBy({id: id});
	}

	async findOneByLogin(login: string): Promise<User | undefined> {
		return this.userRepository.findOneBy({login});
	}

	async findOneByUsername(username: string): Promise<User | undefined> {
		return this.userRepository.findOneBy({username});
	}

	async getAvatar(username: string): Promise<string | undefined> {
		const user = await this.userRepository.findOneBy({username});
		if (!user)
			return
		return user.avatar
	}

	async findUserMatches(userId: number) {
		const user : User = await this.userRepository.findOne({relations: ["winnerMatches", "loserMatches"], where: {id: userId}});
		if (!user)
			return null;
		const matches: Match[] = [...user.winnerMatches, ...user.loserMatches];
		matches.forEach((match) => {
			delete match.winner.login;
			delete match.winner.password;
			delete match.winner.nb_victory;
			delete match.winner.nb_defeat;
			delete match.loser.login;
			delete match.loser.password;
			delete match.loser.nb_victory;
			delete match.loser.nb_defeat;
		});
		return matches;
	}

	addWin(userId: number) {
		this.userRepository.increment({id: userId}, "nb_victory", 1);
	}

	addDefeat(userId: number) {
		this.userRepository.increment({id: userId}, "nb_defeat", 1);
	}

	async changeUsername(userId: number, newUsername: string) {
		this.userRepository.update({id: userId}, {username: newUsername});
		return ("OK");
	}

	async changeAvatar(userId: number, newAvatar: string) {
		this.userRepository.update({id: userId}, {avatar: server_url + '//' + newAvatar});
		return ("OK");
	}

	async getAllUsers() {
		const users: User[] = await this.userRepository.find();
		const parsedUsers: any[] = [];

		users.forEach((user: User) => {
			parsedUsers.push(this.parseUser(user));
		});
		return (parsedUsers);
	}

	parseUser(user: User) {
		return ({
			id: user.id,
			login: user.login,
			username: user.username,
			avatar: user.avatar,
			nb_victory: user.nb_victory,
			nb_defeat: user.nb_defeat
		});
	}

	async getFriendlist(userId: number): Promise<any> {
		const user : User = await this.userRepository.findOne({relations: ["sendRelationships", "recvRelationships"], where: {id: userId}});
		if (!user)
			return null;
		const friend: any[] = [];

		user.sendRelationships.forEach(Relation => {
			if (Relation.status === RelationshipStatus.ACCEPTED)
				friend.push(this.parseUser(Relation.recipient));
		})
		user.recvRelationships.forEach(Relation => {
			if (Relation.status === RelationshipStatus.ACCEPTED)
				friend.push(this.parseUser(Relation.requester));
		})
		return friend;
	}
}
