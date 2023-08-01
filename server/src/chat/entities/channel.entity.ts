import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./message.entity";
import { User } from "src/user/user.entity";

export enum ChanMode {
	PUBLIC = "public",
	PROTECTED = "protected",
	PRIVATE = "private",
	MP = "mp"
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
	mode: string

	@Column({
		type: 'varchar',
		nullable: true
	})
	password: string

	@OneToMany(() => Message, (message) => message.channel)
	messages: Message[]

	@OneToMany(() => User, (user) => user)
	users: User[]
}