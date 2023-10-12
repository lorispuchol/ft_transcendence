import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./message.entity";
import { Participant } from "./participant_chan_x_user.entity";

export enum ChanMode {
	PUBLIC = "public",
	PRIVATE = "private",
	PROTECTED = "protected",
	DM = "dm"
}

@Entity()
export class Channel extends BaseEntity {


	@PrimaryGeneratedColumn()
	id: number

	@Column({
		type: 'varchar',
		length: 33,
		unique: true,
		nullable: false
	})
	name: string

	@Column({
		type: 'enum',
		enum: ChanMode,
		default: ChanMode.PUBLIC
	})
	mode: ChanMode

	
	@Column({
		type: 'varchar',
		nullable: true,
		default: null
	})
	password: string

	@OneToMany(() => Participant, (part) => part.user)
	participants: Participant[]

	@OneToMany(() => Message, (message) => message.channel)
	messages: Message[]

}