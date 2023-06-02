import { Controller, Get, HttpCode, HttpStatus, Query, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "./constants";

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Public()
	@HttpCode(HttpStatus.OK)
	@Get('login')
	signUp(
		@Query('code') code: string,
	) {
		const login = "menfou";
		return this.authService.logIn(login);
	}

	@Get('profile')
	getProfile(@Request() req: any) {
		return req.user;
	}
}
