import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { Participant } from "./entities/participant_chan_x_user.entity";
import { ChanMode, Channel } from "./entities/channel.entity";

@Injectable()
export class ChatService {
	constructor (
		@InjectRepository(Participant, 'lorisforever')
		private participantRepository: Repository<Participant>,
		@InjectRepository(Channel, 'lorisforever')
		private channelRepository: Repository<Channel>
	) {}
	
	async getAllDiscuss(user: User): Promise<Channel[]> {
		const chans: Channel[] = [];
		const parts: Participant[] = await this.participantRepository.find({
			where: {
				user: user.id
			} as FindOptionsWhere<User>
		})
		parts.forEach((part) => chans.push(part.channel))
		return chans;
	}

	async createMp(user1: User, user2: User) {
		const newMp: Channel = await this.channelRepository.create({
			name: user1.login + "+" + user2.login,
			mode: ChanMode.MP
		})
		return await this.channelRepository.save(newMp);
	}

	async getMp(user1: User, user2: User): Promise<Channel> {
		
		const name: string = user1.login + "+" + user2.login
		const reverseName: string = user2.login + "+" + user1.login
		var mp: Channel = await this.channelRepository.findOne({
			where: {
				name: name 
			}
		})

		if(!mp) {
			mp = await this.channelRepository.findOne({
				where: {
					name: reverseName 
				}
			})
		}

		if (!mp)
			return await this.createMp(user1, user2)
		return mp
	}
}