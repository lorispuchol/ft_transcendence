import { User } from "src/user/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Channel } from "./channel.entity";


export enum MemberDistinc {
	INVITED = "invited",
	MEMBER = "member",
	ADMIN = "admin",
	OWNER = "owner",
}

@Entity()
export class Participant extends BaseEntity {
	
	@PrimaryColumn({ type: 'integer', name: 'userId' })
	@ManyToOne(() => User, (user) => user.channels, {eager : true})
	user: User ;

	@PrimaryColumn({ type: 'integer', name: 'channelId' })
	@ManyToOne(() => Channel, (channel) => channel.users, {eager : true})
	channel: Channel ;

	@Column({
		type: "enum",
		enum: MemberDistinc,
		default: MemberDistinc.OWNER
	})
	distinction: string;
}