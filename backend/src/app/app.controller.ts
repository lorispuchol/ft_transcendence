import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from '../auth/constants';

@Controller()
export class AppController {
	// @ts-ignore
	constructor(private readonly appService: AppService) {}

	@Public()
	@Get()
	getHello(): string {
		return "c'est le backend idiot";
	}
}
