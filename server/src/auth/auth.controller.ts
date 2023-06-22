import { Controller, Get, HttpCode, HttpStatus, Query, Redirect, Request, Response } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public, client_url, ftConstants } from "./constants";

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	// when user wants to connect, he is redirected to 42 page authentification generated for our server
	// when he his authentificatedin 42, 42Api redirect to our server auth/login/ with Query: code
	@Public()
	@Get()
	@Redirect(ftConstants.link)
	ftRedirect() {}

	// with the code, client claim a token to 42Api sending uid and secret generated by 42
	// then the client claim infos of 42User sending token
	// Finally we generate a JWT which contain the new user infos (id, username)
	// So when user make a request, AuthGard with JWT is necessary because AuthGard is set as global (except for request decors as Public like login)
	@Public()
	@HttpCode(HttpStatus.OK)
	@Get('login')
	async signUp(
		@Query('code') code: string,
		@Response() res: any,
	) {
		if (!code)
		{
			res.send("42 api code requiered");
			return ;
		}		
		const userData = await this.authService.getDataFtApi(code);
		const token: string = await this.authService.logIn(userData.data.login);
		res.redirect(client_url + "/login?token=" + token);
	}

	@Get('ping')
	getProfile() {
		return {isGood: "true"};
	}

}
