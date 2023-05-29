import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGard } from "./auth.guard";

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@HttpCode(HttpStatus.OK)
	@Post('signup')
	signUp(
		@Body('login') login: string,
		@Body('password') password: string,
		@Body('username') username: string,
	) {
		return this.authService.signUp(login, password, username);
	}

	@HttpCode(HttpStatus.OK)
	@Post('login')
	logIn(@Body() logInDto: Record<string, any>) {
		return this.authService.logIn(logInDto.login, logInDto.password);
	}

	@UseGuards(AuthGard)
	@Get('profile')
	getProfile(@Request() req) {
		return req.user;
	}
}
