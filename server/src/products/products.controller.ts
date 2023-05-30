import { Controller, Post, Body, Get, Param, Patch, Delete } from "@nestjs/common";

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
		return (this.productsService.insertProduct(prodTitle, prodDesc, prodPrice));
	}

	@Get()
	getAllProducts() {
		return this.productsService.getProducts();
	}

	@Get(':id')
	getProduct(@Param('id') prodId: number) {
		return this.productsService.getSingleProduct(prodId);
	}

	@Patch(':id')
	updateProduct(
		@Param('id') prodId: number,
		@Body('title') prodTitle: string,
		@Body('description') prodDesc: string,
		@Body('price') prodPrice: number) {
			this.productsService.updateProduct(prodId, prodTitle, prodDesc, prodPrice);
		}
	
	@Delete(':id')
	removeProduct(@Param('id') prodId: number) {
		this.productsService.deleteProduct(prodId);
	}
}
