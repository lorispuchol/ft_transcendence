import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User, 'lorisforever')
			private userRepository: Repository<User>
	){}

	async createOne(login: string): Promise<User | undefined> {
		const username: string = login;
		const newUser: User = this.userRepository.create({login, username});
		return await this.userRepository.save(newUser);
	}

	async deleteOne(login: string) {
		if (! await this.findOneByLogin(login)) {
			return `Error: User ${login} doesn't exist`
		}
		this.userRepository.delete({login});
		return `User ${login} deleted`;
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

	async changeUsername(userId: number, newUsername: string) {
		try {
			this.userRepository.update({id: userId}, {username: newUsername});
			return ("changed")
		}
		catch (error) {
			return ("taken");
		}
	}

	////dev
	async getAllUsers() {
		return this.userRepository.find();
	}
}
