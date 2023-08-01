import { User } from "src/user/user.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "./channel.entity";

@Entity()
export class Message extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.sendMessages, {eager : true, nullable: false})
	sender: User

	@ManyToOne(() => User, (user) => user.recvMessages, {eager : true, nullable: true})
	receiver: User

	@ManyToOne(() => Channel, (channel) => channel.messages, {eager : true, nullable: true})
	channel: Channel

	@Column({ type: 'text' })
	content: string;

	@CreateDateColumn()
	date: Date;
}