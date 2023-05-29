import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from './product.entity';
import { ProductDto } from "./product.dto";

@Injectable()
export class ProductsService {
	constructor(
		@InjectRepository(Product, 'lorisforever')
		private productRepository: Repository<Product>,
	){}

	insertProduct(title: string, description: string, price: number): Promise<Product> {
		const newProduct = this.productRepository.create(new ProductDto(title, description, price));
		return this.productRepository.save(newProduct);
	}

	getProducts(): Promise<Product[] | null> {
		return this.productRepository.find();
	}

	getSingleProduct(id: number): Promise<Product | null> {
		return this.productRepository.findOneBy({id});
	}


	updateProduct(productId: number, title: string, desc: string, price: number) {
		if (title) {this.productRepository.update({ id: productId }, {title: title});}
		if (desc) {this.productRepository.update({ id: productId }, {description: desc});}
		if (price) {this.productRepository.update({ id: productId }, {price: price});}
	}

	deleteProduct(prodId: number) {
		this.productRepository.delete({id: prodId});
	}

}