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

	newEvent(login: string, event: Event) {
		this.eventGateway.newEvent(login, event);
	}

	deleteEvent(login: string, event: Event) {
		this.eventGateway.deleteEvent(login, event);
	}

	async getUserData(login: string) {
		return await this.userService.findOneByLogin(login);
	}

	async getPendingInvitations(login: string): Promise<string[]> {
		
		const user: User = await this.userService.findOneByLogin(login);
		const pendingInvitations: Relationship[] = await this.relationshipRepository.find({
			where: {
				recipient: user.id,
				status: RelationshipStatus.INVITED
			} as FindOptionsWhere<User>
		});

		const logins: string[] = [];
		pendingInvitations.forEach((invitation) => logins.push(invitation.requester.username)) // pourquoi username et pas login ?
		return logins;
	}

	async getPendingInvitationsChannel(login: string): Promise<string[]> {
		
		const user: User = await this.userService.findOneByLogin(login);
		const pendingInvitationsChannel: Participant[] = await this.participantRepository.find({
			where: {
				user: user.id,
				distinction: MemberDistinc.INVITED
			} as FindOptionsWhere<User>
		});

		const channels: string[] = [];
		pendingInvitationsChannel.forEach((invitationChan) => channels.push(invitationChan.channel.name))
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

	async isBlocked(login: string, blocker: string) {
		const requester: User = await this.userService.findOneByLogin(blocker);
		const recipient: User = await this.userService.findOneByLogin(login);

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
