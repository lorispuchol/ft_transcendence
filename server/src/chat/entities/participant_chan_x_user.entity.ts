import { User } from "src/user/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Channel } from "./channel.entity";


export enum MemberDistinc {
	BANNED = -1,
	INVITED = 0,
	MEMBER = 1,
	ADMIN = 2,
	OWNER = 3,
}

@Entity()
export class Participant extends BaseEntity {
	
	@PrimaryColumn({ type: 'integer', name: 'userId' })
	@ManyToOne(() => User, (user) => user.participants, {eager : true})
	user: User ;

	@PrimaryColumn({ type: 'integer', name: 'channelId' })
	@ManyToOne(() => Channel, (channel) => channel.participants, {eager : true})
	channel: Channel ;

	@Column({
		type: "enum",
		enum: MemberDistinc,
		default: MemberDistinc.OWNER
	})
	distinction: number;
}