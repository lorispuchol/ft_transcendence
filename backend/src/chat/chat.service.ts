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
import { EventService } from "src/event/event.service";

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
		private userService: UserService,
		private eventService: EventService,
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

		const parts: Participant[] = await this.participantRepository.find({
			where: {
				channel: channel.id
			} as FindOptionsWhere<Channel>
		})
		const owner: Participant = parts.find((part) => part.distinction === MemberDistinc.OWNER)
		if (!owner)
			newMember.distinction = MemberDistinc.OWNER;
		else
			newMember.distinction = dist;
		newMember.channel = channel;
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

	async setAnotherOwner(channel: Channel) {
		const parts: Participant[] = await this.participantRepository.find({
			where: {
				channel: channel.id
			} as FindOptionsWhere<Channel>
		})
		if (!parts)
			return ;
		let newOwner: Participant = parts.find((part) => part.distinction === MemberDistinc.ADMIN)
		if (!newOwner)
			newOwner = parts.find((part) => part.distinction === MemberDistinc.MEMBER)
		if (!newOwner)
			return ;
		await this.saveNewMember(newOwner.user, channel, MemberDistinc.OWNER, new Date())
	}

	async getConvs(user: User): Promise<any[]> {

		if (!user)
			return ;

		const chans: any[] = [];
		const parts: Participant[] = await this.participantRepository.find({
			where: {
				user: user.id
			} as FindOptionsWhere<User>
		})
		parts.forEach((part) => chans.push({id: part.channel.id, name: part.channel.name, mode: part.channel.mode}))
		return chans;
	}

	async getNoConvs(user: User): Promise<any[]> {

		if (!user)
			return ;
		
		const convs: Channel[] = await this.getConvs(user);
		const allChans: Channel[] = await this.channelRepository.find();
		let Noconvs: any[] = [];

		allChans.map(chan => {
			if(convs.find((value: Channel) => value.id === chan.id))
				return ;
			if (chan.mode !== ChanMode.DM && chan.mode !== ChanMode.PRIVATE)
				Noconvs.push({id: chan.id, name: chan.name, mode: chan.mode});
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

	async leaveChan(requester: User, chanName: string) {

		if (!requester)
			throw new HttpException("Request impossible", HttpStatus.FORBIDDEN);

		const channel: Channel = await this.findChanByName(chanName)
		if (!channel)
			throw new HttpException("Channel not found", HttpStatus.FORBIDDEN);
		if (channel.mode === ChanMode.DM)
			throw new HttpException("Channel is a Dm", HttpStatus.FORBIDDEN);
		
		const reqPart: Participant = await this.findOneParticipant(channel, requester)

		if (!reqPart || reqPart.distinction < MemberDistinc.MEMBER)
			throw new HttpException("You are not part of " + channel.name, HttpStatus.FORBIDDEN);

		this.deleteMember(requester, channel)
		if (reqPart.distinction === MemberDistinc.OWNER)
			await this.setAnotherOwner(channel)

		return ({status: "OK", description: "You well leave " + channel.name})
	}

	async mute(requester: User, chanName: string, login: string) {		

		if (!requester)
			throw new HttpException("Request impossible", HttpStatus.FORBIDDEN);

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
		if (memberPart.muteDate > new Date()){
			let displayDate: Date = new Date(memberPart.muteDate)
			return ({status: "KO", description: memberPart.user.username + " is already mute until " +  new Date(displayDate).toLocaleTimeString()})
		}
		this.saveNewMember(member, channel, memberPart.distinction, muteDate)

		let displayDate: Date = new Date(muteDate)
		return ({status: "OK", description: memberPart.user.username + " is now mute until " +  new Date(displayDate).toLocaleTimeString()})
	}

	async acceptChan(invited: User, chanName: string) {

		if (!invited)
			return ({status: "KO", description: "Request impossible"})

		const channel: Channel = await this.findChanByName(chanName)
		if (!channel)
			return ({status: "KO", description: "Channel not found"})

		const memberPart: Participant = await this.findOneParticipant(channel, invited)
		if (!memberPart || memberPart.distinction !== MemberDistinc.INVITED)
			return ({status: "KO", description: "You are not invited in " + channel.name})
		this.saveNewMember(invited, channel, MemberDistinc.MEMBER, new Date())
		this.eventService.deleteEvent(invited.id, {type: "channelInvitation", sender: channel.name, senderId: channel.id});
		return ({status: "OK", description: "You are now member of " + channel.name})
	}

	async refuseChan(invited: User, chanName: string) {

		if (!invited)
			return ({status: "KO", description: "Request impossible"})

		const channel: Channel = await this.findChanByName(chanName)
		if (!channel)
			return ({status: "KO", description: "Channel not found"})

		const memberPart: Participant = await this.findOneParticipant(channel, invited)
		if (!memberPart || memberPart.distinction !== MemberDistinc.INVITED)
			return ({status: "KO", description: "You are not invited in " + channel.name})
		this.deleteMember(invited, channel)
		this.eventService.deleteEvent(invited.id, {type: "channelInvitation", sender: channel.name, senderId: channel.id});
		return ({status: "OK", description: "You well decline this invitation"})
	}

	async setDistinction(requester: User, chanName: string, login: string, distinction: MemberDistinc) {

		if (!requester)
			return ({status: "KO", description: "Request impossible"})
		
		if (distinction === MemberDistinc.OWNER)
			return ({status: "KO", description: "Impossible to set someone as owner"})

		const member: User = await this.userService.findOneByLogin(login)
		if (!member)
			return ({status: "KO", description: "User not found"})
		const channel: Channel = await this.findChanByName(chanName)
		if (!channel)
			return ({status: "KO", description: "Channel not found"})
		if (channel.mode === ChanMode.DM)
			return ({status: "KO", description: "Channel is a Dm"})

		const reqPart: Participant = await this.findOneParticipant(channel, requester)
		const memberPart: Participant = await this.findOneParticipant(channel, member)

		if (!reqPart) 
			return ({status: "KO", description: "You are not part of " + channel.name})

		if (!memberPart) {
			if (distinction === MemberDistinc.INVITED) {
				this.saveNewMember(member, channel, MemberDistinc.INVITED, new Date());
				return ({status: "OK", description: "Invitation for " + channel.name + " send to " + member.username})
			}
			else
				return ({status: "KO", description: member.username + " is not part of " + channel.name})
		}		
		if (memberPart.user.id === reqPart.user.id)
				return ({status: "KO", description: "Impossible to change your own accessiblity"})

		if (distinction === MemberDistinc.INVITED) {
			if (memberPart.distinction === MemberDistinc.INVITED)
				return ({status: "KO", description: memberPart.user.username + " is already invited"})
			return ({status: "KO", description: "Impossible to set " + member.username + " as invited"})
		}

		if (reqPart.distinction < MemberDistinc.ADMIN || memberPart.distinction > MemberDistinc.ADMIN)
			return ({status: "KO", description: "You are not ability to do this action"})

		if (memberPart.distinction === distinction)
			return ({status: "KO", description: memberPart.user.username + " is already " + this.getDistStr(distinction)})
		if (memberPart.distinction <= MemberDistinc.INVITED)
			return ({status: "KO", description: member.username + " is not part of " + channel.name + ": " + this.getDistStr(memberPart.distinction)})

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

		if (!user)
			return ({status: "KO", description: "Request impossible"})

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

	async setPwChan(user: User, chanName: string, newPassword: string) {

		if (!user)
			return ({status: "KO", description: "Request impossible"})

		const channel: Channel = await this.findChanByName(chanName);
		if (!channel)
			return ({status: "KO", description: chanName + " not found"})
		const userPart: Participant = await this.findOneParticipant(channel, user)
		if (!userPart)
			return ({status: "KO", description: "You are not part of " + channel.name})
		if (userPart.distinction !== MemberDistinc.OWNER)
			return ({status: "KO", description: `You are not ability to change ${channel.name}'s settings`})
		
		const wasProt: boolean = channel.mode === ChanMode.PROTECTED

		const salt = await bcrypt.genSalt();
		const hash = await bcrypt.hash(newPassword, salt);
		channel.password = hash;
		channel.mode = ChanMode.PROTECTED;
		await this.channelRepository.save(channel);
		return ({status: "OK", description: `Password of ${channel.name} ${wasProt ? "changed" : "set up"}`})
	}

	async changeModeChan(user: User, chanName: string, newMode: ChanMode) {

		if (!user)
			return ({status: "KO", description: "Request impossible"})

		const channel: Channel = await this.findChanByName(chanName);
		if (!channel)
			return ({status: "KO", description: chanName + " not found"})
		const userPart: Participant = await this.findOneParticipant(channel, user)
		if (!userPart)
			return ({status: "KO", description: "You are not part of " + channel.name})
		if (userPart.distinction !== MemberDistinc.OWNER)
			return ({status: "KO", description: `You are not ability to change ${channel.name}'s settings`})
		if (newMode === ChanMode.PROTECTED)
			return ({status: "KO", description: `A new password is required`})
		if (newMode === ChanMode.DM)
			return ({status: "KO", description: "dm mode is not a valid mode"})
		channel.password = null;
		channel.mode = newMode;
		await this.channelRepository.save(channel);
		return ({status: "OK", description: `${channel.name} is now ${newMode}`})
	}

	async createChannel(firstUser: User, name: string, mode: ChanMode, password?: string): Promise<any> {

		if (!firstUser)
			throw new HttpException("Request impossible", HttpStatus.FORBIDDEN);

		if((!password && mode === ChanMode.PROTECTED) ||
			(password && (mode === ChanMode.PRIVATE || mode === ChanMode.PUBLIC))) {
			throw new HttpException("forbidden", HttpStatus.FORBIDDEN);
		}
		const newChan: Channel = this.channelRepository.create({
			name: name,
			mode: mode
		})
		if(password && mode === ChanMode.PROTECTED) {
			const salt = await bcrypt.genSalt();
			const hash = await bcrypt.hash(password, salt);
			newChan.password = hash;
		}
		await this.channelRepository.save(newChan);
		await this.saveNewMember(firstUser, newChan, MemberDistinc.OWNER, new Date())

		return ({id: newChan.id, name: newChan.name,mode: newChan.mode})
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

		const channel: Channel = await this.channelRepository.findOne({
			relations: ["participants"],
			where: {name: chanName},
		});
		if(!channel)
			return null;

		let parts: any[] = [];
		channel.participants.forEach((part) => {
			parts.push({
				user: {
					id: part.user.id,
					login: part.user.login,
					username: part.user.username,
					avatar: part.user.avatar,
					nb_victory: part.user.nb_victory,
					nb_defeat: part.user.nb_defeat
				},
				channel: {
					id: part.channel.id,
					name: part.channel.name,
					mode: part.channel.mode
				},
				distinction: part.distinction,
				muteDate: part.muteDate})
		})
		return parts;
	}

	async saveNewMsg(sender: User, chan: Channel, content: string) {
		const newMsg: Message = this.messagesRepository.create({
			sender: sender,
			channel: chan,
			content: content,
		})
		return this.messagesRepository.save(newMsg)
	}

	async getDm(user1: User, user2: User): Promise<Channel> {

		if (!user1)
			throw new HttpException("Request impossible", HttpStatus.FORBIDDEN);
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
			return [];
		
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