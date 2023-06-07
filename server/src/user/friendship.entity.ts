import { Entity, ManyToOne, Column, JoinColumn, PrimaryColumn, PrimaryGeneratedColumn, BaseEntity} from "typeorm";
import { User } from "./user.entity";

export enum FriendshipStatus {
	INVITED = "invited",
	ACCEPTED = "accepted",
	BLOCKED = "blocked",
}

@Entity()
export class Friendship extends BaseEntity {

	// @ PC create PK column named requesterId
	// @ MTO create FK column automatically named as: <property> + "Id"
	// Because this two columns have now the same name they are like 'merged' in only one 
	@PrimaryColumn({ type: 'integer', name: 'requesterId' })
	@ManyToOne(() => User, (recipient) => recipient.friendships )
	requester: User ;

	@PrimaryColumn({ type: 'integer', name: 'recipientId' })
	@ManyToOne(() => User, (requester) => requester.friendships )
	recipient: User ;

	@Column({
		type: "enum",
		enum: FriendshipStatus,
	})
	status: string;
}