import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { MemberDistinc, Participant } from "./entities/participant_chan_x_user.entity";
import { ChanMode, Channel } from "./entities/channel.entity";
import { Message } from "./entities/message.entity";
import { RelationshipService } from "src/relationship/relationship.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class ChatService {
	constructor (
		@InjectRepository(Participant, 'lorisforever')
		private participantRepository: Repository<Participant>,

		@InjectRepository(Channel, 'lorisforever')
		private channelRepository: Repository<Channel>,

		@InjectRepository(Message, 'lorisforever')
		private messagesRepository: Repository<Message>,

		private relationshipService: RelationshipService,
		private userService: UserService
	) {}
	
	async getConvs(user: User): Promise<Channel[]> {
		const chans: Channel[] = [];
		const parts: Participant[] = await this.participantRepository.find({
			where: {
				user: user.id
			} as FindOptionsWhere<User>
		})
		parts.forEach((part) => chans.push(part.channel))
		return chans;
	}

	async createDm(user1: User, user2: User) {
		const newMp: Channel = await this.channelRepository.create({
			name: user1.login + "+" + user2.login,
			mode: ChanMode.DM
		})
		
		const newPart1: Participant = new Participant()
		newPart1.channel = newMp;
		newPart1.distinction = MemberDistinc.OWNER;
		newPart1.user = user1;

		const newPart2: Participant = new Participant()
		newPart2.channel = newMp;
		newPart2.distinction = MemberDistinc.OWNER;
		newPart2.user = user2;

		await this.channelRepository.save(newMp);
		await this.participantRepository.save(newPart1);
		await this.participantRepository.save(newPart2);
		return newMp
	}

	async findChanByName(name: string): Promise<Channel | undefined> {
		return await this.channelRepository.findOneBy({name});
	}

	async getAllMembers(chanName: string) {
	
		const channel: Channel = await this.findChanByName(chanName);

		if(!channel)
			return null;

		const participants: Participant[] = await this.participantRepository.find({
			where: {
				channel: channel.id
			} as FindOptionsWhere<Channel>
		})
		return participants;
	}

	async saveNewMsg(sender: User, chan: Channel, content: string) {
		const newMsg: Message = await this.messagesRepository.create({
			sender: sender,
			channel: chan,
			content: content,
		})
		return this.messagesRepository.save(newMsg)
	}

	async getDm(user1: User, user2: User): Promise<Channel> {
		
		if (user1.login === user2.login)
			throw new HttpException("forbidden", HttpStatus.FORBIDDEN);
		const name: string = user1.login + "+" + user2.login
		const reverseName: string = user2.login + "+" + user1.login
		let dm: Channel = await this.channelRepository.findOne({
			where: {
				name: name 
			}
		})

		if(!dm) {
			dm = await this.channelRepository.findOne({
				where: {
					name: reverseName 
				}
			})
		}
		if (!dm)
			return await this.createDm(user1, user2)
		return dm
	}

	async getMessages(user: string, chan: string): Promise<Message[]> {
		const channel = await this.channelRepository.findOne({
			where: {
				name: chan
			}
		})
		if (!channel)
			return null;
		
		const messages: Message[] = await this.messagesRepository.find({
			where: {
				channel: channel
			} as FindOptionsWhere<Channel>
		})
		// return messages;

		const u: User = await this.userService.findOneByLogin(user);
		const displayMessages: Message[] = [];
		const request = messages.map( async (msg) => {	
			if (!await this.relationshipService.ReqIsBlocked(msg.sender, u))
				displayMessages.push(msg)
		})
		return Promise.all(request).then(() => displayMessages);
	}
}