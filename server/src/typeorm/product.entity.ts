import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
	@PrimaryGeneratedColumn({
		type: 'bigint',
		name: 'product_id',
	})
	id: number;

	@Column({
		nullable: false,
		default: ' ',
	})
	title: string;

	@Clo
}
