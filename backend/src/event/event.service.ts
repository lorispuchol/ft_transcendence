import { Injectable } from "@nestjs/common";
import { EventGateway } from "./event.gateway";
import { InjectRepository } from "@nestjs/typeorm";
import { Relationship, RelationshipStatus } from "src/relationship/relationship.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { UserService } from "src/user/user.service";
import { User } from "src/user/user.entity";
import { MemberDistinc, Participant } from "src/chat/entities/participant_chan_x_user.entity";

interface Event {
	type: string,
	sender: string,
	senderId: number | string,
}

interface Sender {
	id: number,
	username: string,
}

@Injectable()
export class EventService {
	constructor(
		private	eventGateway: EventGateway,
		@InjectRepository(Relationship, 'lorisforever')
			private relationshipRepository: Repository<Relationship>,
		@InjectRepository(Participant, 'lorisforever')
			private participantRepository: Repository<Participant>,
		private userService: UserService,
	) {}

	isAlreadyConnected(userId: number): boolean {
		return (this.eventGateway.isAlreadyConnected(userId));
	}

	newEvent(userId: number, event: Event) {
		this.eventGateway.newEvent(userId, event);
	}

	deleteEvent(userId: number, event: Event) {
		this.eventGateway.deleteEvent(userId, event);
	}

	sendInGame(userId: number, statu: boolean) {
		this.eventGateway.sendInGame(userId, statu);
	}

	async getUserData(id: number) {
		return await this.userService.findOneById(id);
	}

	async getPendingInvitations(userId: number): Promise<Sender[]> {
		
		const user: User = await this.userService.findOneById(userId);
		const pendingInvitations: Relationship[] = await this.relationshipRepository.find({
			where: {
				recipient: user.id,
				status: RelationshipStatus.INVITED
			} as FindOptionsWhere<User>
		});

		const senders: Sender[] = [];
		pendingInvitations.forEach((invitation) => senders.push({id: invitation.requester.id, username: invitation.requester.username}))
		return senders;
	}

	async getPendingInvitationsChannel(userId: number): Promise<Sender[]> {
		
		const user: User = await this.userService.findOneById(userId);
		const pendingInvitationsChannel: Participant[] = await this.participantRepository.find({
			where: {
				user: user.id,
				distinction: MemberDistinc.INVITED
			} as FindOptionsWhere<User>
		});

		const channels: Sender[] = [];
		pendingInvitationsChannel.forEach((invitationChan) => channels.push({username: invitationChan.channel.name, id: invitationChan.channel.id}))
		return channels;
	}

	async getBlockeds(login: string) {
		const user: User = await this.userService.findOneByLogin(login);
		const id: number = user.id;
		const blockeds: Relationship[] = await this.relationshipRepository.find({
			relations: ["requester", "recipient"],
			where: {
				recipient: id,
				status: RelationshipStatus.BLOCKED,
			} as FindOptionsWhere<User>
		});
		return blockeds;
	}

	async isBlocked(userId: number, blockerId: number) {
		const requester: User = await this.userService.findOneById(blockerId);
		const recipient: User = await this.userService.findOneById(userId);

		if (!requester || !recipient)
			return (false);

		const relation: Relationship = await this.relationshipRepository.findOne({
			relations: ["requester", "recipient"],
			where: {
				requester: requester.id,
				recipient: recipient.id
			} as FindOptionsWhere<User>
		});
		if (relation && relation.status === RelationshipStatus.BLOCKED)
			return true;
		return false;
	}
}
