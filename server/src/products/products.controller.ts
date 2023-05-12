import { Controller, Post, Body, Get } from "@nestjs/common";

import { Product } from "./product.model";
import { ProductsService } from "./products.service";

@Controller('products')
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Post()
	addProduct(
		@Body('title') prodTitle: string,
		@Body('description') prodDesc: string,
		@Body('price') prodPrice: number
	) {
		const generatedId = this.productsService.insertProduct(prodTitle, prodDesc, prodPrice);
		return {id: generatedId}
	}

	@Get()
	displayProducts() {
		return this.productsService.getProducts();
	}
}
