import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
	@PrimaryGeneratedColumn({
		type: 'integer',
	})
	id: number;

	@Column({
		type: 'varchar',
		nullable: false,
	})
	login: string;

	@Column({
		type: 'varchar',
		nullable: false,
	})
	password: string;

	@Column({
		type: 'varchar',
		nullable: false,
	})
	username: string;

	@Column({
		type: 'bytea',
		nullable: true,
	})
	avatar: Buffer;

	@Column({
		type: 'varchar',
		nullable: false,
		default: 'online',
	})
	status: string;

	@Column({
		type: 'integer',
		nullable: false,
		default: 0,
	})
	winNb: number;

	@Column({
		type: 'integer',
		nullable: false,
		default: 0,
	})
	looseNb: number;
}
