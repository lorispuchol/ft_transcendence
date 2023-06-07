import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Friendship } from "./friendship.entity";

export enum UserStatus {
    OFFLINE = "offline",
    ONLINE = "online",
    GAME = "game",
}

@Entity()
export class User {
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
		length: 64,
		nullable: true,
		unique: true,
	})
	username: string;

	@Column({
		type: 'bytea',
		nullable: true,
		default: null,
	})
	avatar: Buffer;

	@Column({
		type: "enum",
		enum: UserStatus,
		default: UserStatus.ONLINE,
	})
	status: string;

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

	@OneToMany(() => Friendship, (friendship) => friendship)
	friendships: Friendship[];
}
