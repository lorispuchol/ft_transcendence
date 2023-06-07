import { Controller, Get, HttpCode, HttpStatus, Query, Redirect, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public, ftConstants } from "./constants";

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Public()
	@Get()
	@Redirect(ftConstants.link)
	ftRedirect() {
	}

	@Public()
	@HttpCode(HttpStatus.OK)
	@Get('login')
	async signUp(
		@Query('code') code: string,
	) {
		const userData = await this.authService.getDataFtApi(code);
		return this.authService.logIn(userData.data.login);
	}

	///dev
	@Get('profile')
	getProfile(@Request() req: any) {
		return req.user;
	}

}
