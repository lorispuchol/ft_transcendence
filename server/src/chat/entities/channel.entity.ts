import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./message.entity";
import { User } from "src/user/user.entity";

export enum ChanMode {
	PRIVATE = "private",
	PUBLIC = "public",
	PROTECTED = "protected"
}

@Entity()
export class Channel extends BaseEntity {


	@PrimaryGeneratedColumn()
	id: number

	@Column({
		type: 'varchar',
		length: 32,
		unique: true
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