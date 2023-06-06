import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";


@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService
		) {}
	
	async logIn(login: string): Promise<any> {
		let user: User = await this.userService.findOne(login);
		if (!user)
			user = await this.userService.createOne(login);
		//add username generator if you want loris
	
		const payload = {id: user.id, login: user.username};

		return {
			access_token: await this.jwtService.signAsync(payload),
			login: user.login,
		};
	}
}
