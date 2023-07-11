import { Column, Entity, PrimaryGeneratedColumn, OneToMany, BaseEntity } from "typeorm";
import { Relationship } from "../relationship/relationship.entity";

export enum UserStatus {
    OFFLINE = "offline",
    ONLINE = "online",
    GAME = "game",
}

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

	@OneToMany(() => Relationship, (relationship) => relationship)
	relationships: Relationship[];
}
