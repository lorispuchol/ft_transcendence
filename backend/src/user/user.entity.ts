import { Column, Entity, PrimaryGeneratedColumn, OneToMany, BaseEntity } from "typeorm";
import { Relationship } from "../relationship/relationship.entity";
import { Message } from "src/chat/entities/message.entity";
import { Match } from "src/game/match.entity";
import { Participant } from "src/chat/entities/participant_chan_x_user.entity";

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'varchar',
		length: 16,
		unique: true,
	})
	login: string;
	
	@Column({
		type: 'varchar',
		length: 16,
		nullable: false,
		unique: true,
	})
	username: string;

	@Column({
		type: 'varchar',
		nullable: true,
		default: null,
	})
	password: string;

	@Column({
		type: 'varchar',
		nullable: true,
		default: null,
	})
	avatar: string;

	@Column({
		type: 'integer',
		default: 0,
	})
	nb_victory: number;

	@Column({
		type: 'integer',
		default: 0,
	})
	nb_defeat: number;

	@OneToMany(() => Relationship, (relationship) => relationship.requester)
	sendRelationships: Relationship[];

	@OneToMany(() => Relationship, (relationship) => relationship.recipient)
	recvRelationships: Relationship[];
	
	@OneToMany(() => Message, (message) => message.sender)
	sendMessages: Message[];

	@OneToMany(() => Participant, (part) => part.user)
	participants: Participant[]

	@OneToMany(() => Match, (match) => match.winner)
	winnerMatches: Match[]
	
	@OneToMany(() => Match, (match) => match.loser)
	loserMatches: Match[]
}
