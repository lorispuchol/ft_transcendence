import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { ftConstants } from "./constants";
import axios, { AxiosResponse } from "axios";
import * as bcrypt from 'bcrypt';
import { EventService } from "src/event/event.service";

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private eventService: EventService,
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

	async logIn(login: string): Promise<string> {
		let user: User = await this.userService.findOneByLogin(login);
		if (!user)
			user = await this.userService.createOne(login);
	
		const payload = {id: user.id, login: user.login};
		if (this.eventService.isAlreadyConnected(payload.id))
			return "";
		return await this.jwtService.signAsync(payload);
	}

	async logInWithPassword(username: string): Promise<Object> {
		const user: User = await this.userService.findOneByUsername(username);

		const payload = {id: user.id, login: user.login};
		return {status: "OK", token: await this.jwtService.signAsync(payload)};
	}

	async createUserWithPassword(username: string, password: string): Promise<string> {
		const salt = await bcrypt.genSalt();
		const hash = await bcrypt.hash(password, salt);
		const user: User = await this.userService.createOne(username, hash);
		
		const payload = {id: user.id, login: user.login};
		return this.jwtService.signAsync(payload);
	}
}