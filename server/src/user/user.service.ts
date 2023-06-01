import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User, 'lorisforever')
		private userRepository: Repository<User>,
	){}

	async createOne(login: string, password: string, username: string): Promise<User | undefined> {
		const newUser: User = this.userRepository.create({login, password, username});
		return this.userRepository.save(newUser);
	}
	
	async findOne(login: string): Promise<User | undefined> {
		return this.userRepository.findOneBy({login});
	}
}
