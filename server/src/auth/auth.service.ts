import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";


@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService
		) {}

	async signUp(login: string, password: string, username: string) {
		const newUser = await this.userService.createOne(login, password, username);
		const payload = { sub: newUser.id, login: newUser.login};

		return {
			access_token: await this.jwtService.signAsync(payload),
			login: newUser.login,
			password: newUser.password,
			username: newUser.username,
		}
	}
	
	async logIn(login: string, pass: string): Promise<any> {
		const user = await this.userService.findOne(login);
		if (user?.password !== pass) {
			throw new UnauthorizedException();
		}
		const payload = {id: user.id, username: user.username };

		return {access_token: await this.jwtService.signAsync(payload)};
	}
}
