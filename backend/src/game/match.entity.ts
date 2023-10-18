import { User } from "src/user/user.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Match extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	// challenger is the inviter 
	// or the user with smallest id
	@ManyToOne(() => User, (user) => user.userMatches, {eager : true})
	user: User;

	@ManyToOne(() => User, (user) => user.opponMatches, {eager : true})
	opponent: User;

	@Column({type: 'varchar'})
	mode: string;

	@Column({ type: 'integer' })
	user_score: number;

	@Column({ type: 'integer' })
	opponent_score: number;

	@CreateDateColumn()
	date: Date;
}