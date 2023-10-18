import { User } from "src/user/user.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Match extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.winnerMatches, {eager : true})
	winner: User;

	@ManyToOne(() => User, (user) => user.loserMatches, {eager : true})
	loser: User;

	@Column({type: 'varchar'})
	mode: string;

	@Column({ type: 'integer' })
	winner_score: number;

	@Column({ type: 'integer' })
	loser_score: number;

	@CreateDateColumn()
	date: Date;
}