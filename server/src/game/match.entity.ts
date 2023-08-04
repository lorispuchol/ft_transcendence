import { User } from "src/user/user.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Match extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	// challenger is the inviter 
	// or the user with smallest id
	@ManyToOne(() => User, (user) => user.challengeMatches, {eager : true})
	challenger: User

	@ManyToOne(() => User, (user) => user.opponMatches, {eager : true})
	opponent: User

	@Column({ type: 'integer' })
	challenger_score: number;

	@Column({ type: 'integer' })
	opponent_score: number;

	@CreateDateColumn()
	date: Date;
}