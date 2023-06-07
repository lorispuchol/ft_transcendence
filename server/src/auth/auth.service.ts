import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { ftConstants } from "./constants";
import axios, { AxiosResponse } from "axios";


@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService
		) {}
	
	async getDataFtApi(code: string): Promise<AxiosResponse<any, any>> {
		const data = {
			grant_type: "authorization_code",
			client_id: ftConstants.uid,
			client_secret: ftConstants.secret,
			code: code,
			redirect_uri: ftConstants.redirect_uri,
		};
		const getToken = await axios.post("https://api.intra.42.fr/oauth/token", data);
		return (axios.get("https://api.intra.42.fr/v2/me", {
			headers: { Authorization:'Bearer ' + getToken.data.access_token },
		}));
	}

	async logIn(login: string): Promise<any> {
		let user: User = await this.userService.findOne(login);
		if (!user)
			user = await this.userService.createOne(login);
		//add username generator if you want loris
	
		const payload = {id: user.id, login: user.username};

		return { access_token: await this.jwtService.signAsync(payload) };
	}
}
