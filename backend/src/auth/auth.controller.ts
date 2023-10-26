import { Body, Controller, DefaultValuePipe, Get, HttpCode, HttpStatus, Param, Post, Query, Redirect, Request, Response, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public, client_url, ftConstants } from "./constants";
import { NewUserWithPassword, UserWithPassword } from "./auth.dto";
import { TwoFactorGard } from "./auth.guard";

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
	async signInBy42(
		@Query('code') code: string,
		@Response() res: any,
	) {
		if (!code)
		{
			res.send("42 api code requiered");
			return ;
		}
		try {
			const userData = await this.authService.getDataFtApi(code);
			const {token, otp_secret}: {token: string, otp_secret: string} = await this.authService.logIn(userData.data.login);
			if (!token)
			{
				res.redirect(client_url + "/login?alreadyHere=" + userData.data.login);
				return ;
			}
			if (otp_secret) //check fo 2FA
			{
				res.redirect(client_url + "/login?authtoken=" + token);
				return ;
			}
			res.redirect(client_url + "/login?token=" + token);
		}
		catch (error) {
			res.send("something went wrong with 42 api");
		}
	}

	// let totp = new OTPAuth.TOTP({
	// 	issuer: "codevoweb.com",
	// 	label: "CodevoWeb",
	// 	algorithm: "SHA1",
	// 	digits: 6,
	// 	secret: user.otp_base32!,
	//   });
  
	//   let delta = totp.validate({ token, window: 1 });
	
	@Public()
	@Post('login')
	login(
		@Body() user: UserWithPassword
	) {
		return (this.authService.logInWithPassword(user.username));
	}

	@Public()
	@Post('signup')
	signUp(
		@Body() user: NewUserWithPassword
	) {
		return (this.authService.createUserWithPassword(user.username, user.password));
	}

	@Public()
	@UseGuards(TwoFactorGard)
	@Get('2FaCode')
	checkFaCode(@Request() req: any, @Param('code', DefaultValuePipe) code: number) {
		// const token = this.authService.checkFaCode(req.user.id, code);
	}


	@Get('setup2FA')
	setup2FA(@Request() req: any) {
		return (this.authService.setup2FA(req.user.id));
	}
}
