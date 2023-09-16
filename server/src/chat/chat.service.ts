import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { MemberDistinc, Participant } from "./entities/participant_chan_x_user.entity";
import { ChanMode, Channel } from "./entities/channel.entity";
import { Message } from "./entities/message.entity";
import { RelationshipService } from "src/relationship/relationship.service";
import { UserService } from "src/user/user.service";
import * as bcrypt from 'bcrypt';

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

	getDistStr(dist: MemberDistinc): string {
		if (dist === MemberDistinc.MEMBER) return "member"
		if (dist === MemberDistinc.INVITED) return "invited"
		if (dist === MemberDistinc.KICK) return "kicked"
		if (dist === MemberDistinc.ADMIN) return "admin"
		if (dist === MemberDistinc.BANNED) return "banned"
	}

	async saveNewMember(user: User, channel: Channel, dist: MemberDistinc, muteDate: Date) {
		
		const newMember: Participant = new Participant();

		newMember.channel = channel;
		newMember.distinction = dist;
		newMember.user = user;
		newMember.muteDate = muteDate

		await this.participantRepository.save(newMember);
	}

	async deleteMember(user: User, channel: Channel) {
		await this.participantRepository.delete({
			user: {id: user.id},
			channel: {id: channel.id}
		});
	}
	
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

	async getNoConvs(user: User): Promise<Channel[]> {
		
		const convs: Channel[] = await this.getConvs(user);
		const allChans: Channel[] = await this.channelRepository.find();
		let Noconvs: Channel[] = [];

		allChans.map(chan => {
			if(convs.find((value: Channel) => value.id === chan.id))
				return ;
			if (chan.mode !== ChanMode.DM && chan.mode !== ChanMode.PRIVATE)
				Noconvs.push(chan);
		})
		return Noconvs;
	}

	async findOneParticipant(channel: Channel, user: User): Promise<Participant> {
		const parts: Participant[] = await this.participantRepository.find({
			where: {
				channel: channel.id
			} as FindOptionsWhere<Channel>
		})
		return parts.find((part) => part.user.id === user.id)
	}

	async mute(requester: User, chanName: string, login: string) {		
		var muteDate: Date = new Date();
		muteDate.setMinutes(muteDate.getMinutes() + 1)

		const member: User = await this.userService.findOneByLogin(login)
		if (!member)
			throw new HttpException("User not found", HttpStatus.FORBIDDEN);
		const channel: Channel = await this.findChanByName(chanName)
		if (!channel)
			throw new HttpException("Channel not found", HttpStatus.FORBIDDEN);
		if (channel.mode === ChanMode.DM)
			throw new HttpException("Channel is a Dm", HttpStatus.FORBIDDEN);

		
		const reqPart: Participant = await this.findOneParticipant(channel, requester)
		const memberPart: Participant = await this.findOneParticipant(channel, member)

		if (!reqPart) 
			throw new HttpException("You are not part of " + channel.name, HttpStatus.FORBIDDEN);
		if (!memberPart)
			throw new HttpException(member.username + " is not part of " + channel.name, HttpStatus.FORBIDDEN);

		if (memberPart.user.id === reqPart.user.id)
			throw new HttpException("Impossible to change your own accessiblity", HttpStatus.FORBIDDEN);

		if (reqPart.distinction < MemberDistinc.ADMIN || memberPart.distinction > MemberDistinc.ADMIN)
			throw new HttpException("You are not ability to do this action", HttpStatus.FORBIDDEN);
		if (memberPart.distinction <= MemberDistinc.INVITED)
			throw new HttpException(member.username + " is not part of " + channel.name + ": " + this.getDistStr(memberPart.distinction), HttpStatus.FORBIDDEN);
		if (memberPart.muteDate > new Date())
			return ({status: "KO", description: memberPart.user.username + " is already mute until " +  new Date(memberPart.muteDate).toLocaleTimeString()})
		this.saveNewMember(member, channel, memberPart.distinction, muteDate)
		return ({status: "OK", description: memberPart.user.username + " is now mute until " +  new Date(muteDate).toLocaleTimeString()})
	}

	async setDistinction(requester: User, chanName: string, login: string, distinction: MemberDistinc) {
		
		if (distinction === MemberDistinc.OWNER)
			return ({status: "KO", description: "Impossible to set someone as owner"})

		const member: User = await this.userService.findOneByLogin(login)
		if (!member)
			throw new HttpException("User not found", HttpStatus.FORBIDDEN);
		const channel: Channel = await this.findChanByName(chanName)
		if (!channel)
			throw new HttpException("Channel not found", HttpStatus.FORBIDDEN);
		if (channel.mode === ChanMode.DM)
			throw new HttpException("Channel is a Dm", HttpStatus.FORBIDDEN);

		const reqPart: Participant = await this.findOneParticipant(channel, requester)
		const memberPart: Participant = await this.findOneParticipant(channel, member)

		if (!reqPart) 
			throw new HttpException("You are not part of " + channel.name, HttpStatus.FORBIDDEN);

		if (!memberPart) {
			if (distinction === MemberDistinc.INVITED) {
				this.saveNewMember(member, channel, MemberDistinc.INVITED, memberPart.muteDate);
				return ({status: "OK", description: "Invitation for " + channel.name + " send to " + member.username})
			}
			else
				throw new HttpException(member.username + " is not part of " + channel.name, HttpStatus.FORBIDDEN);
		}		
		if (memberPart.user.id === reqPart.user.id)
			throw new HttpException("Impossible to change your own accessiblity", HttpStatus.FORBIDDEN);

		if (distinction === MemberDistinc.INVITED) {
			if (memberPart.distinction === MemberDistinc.INVITED)
				return ({status: "KO", description: memberPart.user.username + " is already invited"})
			throw new HttpException("Impossible to set " + member.username + " as invited", HttpStatus.FORBIDDEN);
		}

		if (reqPart.distinction < MemberDistinc.ADMIN || memberPart.distinction > MemberDistinc.ADMIN)
			throw new HttpException("You are not ability to do this action", HttpStatus.FORBIDDEN);
		if (memberPart.distinction === distinction)
			return ({status: "KO", description: memberPart.user.username + " is already " + this.getDistStr(distinction)})
		if (memberPart.distinction <= MemberDistinc.INVITED)
			throw new HttpException(member.username + " is not part of " + channel.name + ": " + this.getDistStr(memberPart.distinction), HttpStatus.FORBIDDEN);
		if (distinction === MemberDistinc.KICK) {
			this.deleteMember(member, channel);
			return ({status: "OK", description: member.username + " kicked from " + channel.name})
		}
		this.saveNewMember(member, channel, distinction, memberPart.muteDate)
		return ({status: "OK", description: memberPart.user.username + " is now " + this.getDistStr(distinction)})
	}

	async addMemberToChan(user: User, channel: Channel, distinction: MemberDistinc) {

		let checkParts: Participant = await this.findOneParticipant(channel, user);

		if (checkParts) {
			if (checkParts.distinction <= MemberDistinc.BANNED)
				return ({status: "KO", description: "You are banned from this channel"})
			else if (checkParts.distinction >= MemberDistinc.INVITED)
				return ({status: "KO", description: user.username + " is already " + this.getDistStr(checkParts.distinction)})
		}
		this.saveNewMember(user, channel, distinction, new Date())
		return ({status: "OK", description: user.username + " added to " + channel.name})
	}

	async joinChan(user: User, chanName: string, password: string) {
		const channel: Channel = await this.findChanByName(chanName);
		if (!channel)
			return ({status: "KO", description: chanName + " not found"})
		if (channel.mode === ChanMode.DM)
			return ({status: "KO", description: chanName + " is a Dm"})
		if (channel.mode === ChanMode.PRIVATE)
			return ({status: "KO", description: chanName + " is private"})
		if (!password && channel.mode === ChanMode.PROTECTED)
			return ({status: "KO", description: chanName + " is protected by a password"})
		return (await this.addMemberToChan(user, channel, MemberDistinc.MEMBER))
	}

	async createChannel(firstUser: User, name: string, mode: ChanMode, password?: string) {

		if((!password && mode === ChanMode.PROTECTED) ||
			(password && (mode === ChanMode.PRIVATE || mode === ChanMode.PUBLIC))) {
			throw new HttpException("forbidden", HttpStatus.FORBIDDEN);
		}
		const newChan: Channel = await this.channelRepository.create({
			name: name,
			mode: mode
		})
		if(password) {
			const salt = await bcrypt.genSalt();
			const hash = await bcrypt.hash(password, salt);
			newChan.password = hash;
		}
		await this.channelRepository.save(newChan);
		await this.saveNewMember(firstUser, newChan, MemberDistinc.OWNER, new Date())
		return newChan
	}

	async createDm(user1: User, user2: User) {
		const newMp: Channel = await this.channelRepository.create({
			name: user1.login + "+" + user2.login,
			mode: ChanMode.DM
		})
		await this.channelRepository.save(newMp);

		await this.saveNewMember(user1, newMp, MemberDistinc.OWNER, new Date())
		await this.saveNewMember(user2, newMp, MemberDistinc.OWNER, new Date())

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
		
		if (!user2)
			throw new HttpException("User not found", HttpStatus.FORBIDDEN);
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
		const u: User = await this.userService.findOneByLogin(user);
		if (!u)
			throw new HttpException("forbidden", HttpStatus.FORBIDDEN);
		const displayMessages: Message[] = [];
		const request = messages.map( async (msg) => {	
			if (!await this.relationshipService.ReqIsBlocked(msg.sender, u))
				displayMessages.push(msg)
		})
		return Promise.all(request).then(() => displayMessages);
	}
}