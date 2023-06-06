import { Controller, Get, HttpCode, HttpStatus, Query, Redirect, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public, ftConstants } from "./constants";
import axios from "axios";

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
		const data = {
			grant_type: "authorization_code",
			client_id: ftConstants.uid,
			client_secret: ftConstants.secret,
			code: code,
			redirect_uri: 'http://10.12.9.2:8080/auth/login'
		};
		const getToken = await axios.post("https://api.intra.42.fr/oauth/token", data);
		const userData = await axios.get("https://api.intra.42.fr/v2/me", {
			headers: { Authorization:'Bearer ' + getToken.data.access_token },
		});
		//const userData = await axios.get("https://api.intra.42.fr/v2/me" + "?access_token=" + response.data.access_token);
		return this.authService.logIn(userData.data.login);
	}

	@Get('profile')
	getProfile(@Request() req: any) {
		return req.user;
	}

}
