import { Entity, ManyToOne, Column, JoinColumn, PrimaryColumn, PrimaryGeneratedColumn, BaseEntity} from "typeorm";
import { User } from "../user/user.entity";

export enum RelationshipStatus {
	INVITED = "invited",
	ACCEPTED = "accepted",
	BLOCKED = "blocked",
}

@Entity()
export class Relationship extends BaseEntity {

	// @PC create PK column named requesterId
	// @MTO create FK column automatically named as: <property> + "Id"
	// Because this two columns have now the same name they are like 'merged' in only one 
	@PrimaryColumn({ type: 'integer', name: 'requesterId' })
	@ManyToOne(() => User, (recipient) => recipient.relationships )
	requester: User ;

	@PrimaryColumn({ type: 'integer', name: 'recipientId' })
	@ManyToOne(() => User, (requester) => requester.relationships )
	recipient: User ;

	@Column({
		type: "enum",
		enum: RelationshipStatus,
	})
	status: string;
}