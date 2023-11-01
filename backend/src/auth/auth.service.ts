import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { ftConstants, jwtConstants } from "./constants";
import axios, { AxiosResponse } from "axios";
import * as bcrypt from 'bcrypt';
import * as OTPAuth from "otpauth";
import { EventService } from "src/event/event.service";
import { encode } from "hi-base32";

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

	async logIn(login: string): Promise<{token: string, otp_secret: string, firstLog: boolean} | null> {
		let user: User = await this.userService.findOneByLogin(login);
		const firstLog = user ? false : true;
		if (!user)
			user = await this.userService.createOne(login);
	
		if (this.eventService.isAlreadyConnected(user.id))
			return {token: null, otp_secret: "", firstLog};
		
		const payload = {id: user.id, login: user.login};
		if (user.otp_secret)
			return ({
				token: await this.jwtService.signAsync(payload, {secret: jwtConstants.two_factor_secret}),
				otp_secret: user.otp_secret,
				firstLog,
			});
		return {token: await this.jwtService.signAsync(payload), otp_secret: user.otp_secret, firstLog};
	}

	async logInWithPassword(username: string): Promise<Object> {
		const user: User = await this.userService.findOneByUsername(username);
		
		if (user.otp_secret)
			return {authToken: await this.jwtService.signAsync({id: user.id}, {secret: jwtConstants.two_factor_secret})};

		const payload = {id: user.id, login: user.login};
		return {token: await this.jwtService.signAsync(payload)};
	}

	async createUserWithPassword(username: string, password: string): Promise<string> {
		const salt = await bcrypt.genSalt();
		const hash = await bcrypt.hash(password, salt);
		const user: User = await this.userService.createOne(username, hash);
		
		const payload = {id: user.id, login: user.login};
		return this.jwtService.signAsync(payload);
	}

	generateRandomBase32() {
		const buffer = crypto.randomUUID();
		const base32 = encode(buffer).replace(/=/g, "").substring(0, 24);
		return base32;
	  };

	async setup2FA(userId: number) {
		const user: User = await this.userService.findOneById(userId);
		if (!user)
			return ;
		
		const secret = this.generateRandomBase32();
		const totp = new OTPAuth.TOTP({
			issuer: "elpongo.fr",
			label: "el pongo",
			algorithm: "SHA1",
			digits: 6,
			secret: secret,
		});
		const otp_url = totp.toString();

		this.userService.addOtpSecret(userId, secret);

		return ({otp_url});
	}

	rm2FA(userId: number) {
		this.userService.rmOtpSecret(userId);
		return true;
	}

	async checkFaCode(userId: number, code: string) {
		const user = await this.userService.findOneById(userId);
		if (!user)
			return "";

		const totp = new OTPAuth.TOTP({
			issuer: "elpongo.fr",
			label: "el pongo",
			algorithm: "SHA1",
			digits: 6,
			secret: user.otp_secret
		});
		const delta = totp.validate({token: code, window: 1});
		if (delta === null)
			return "";

		const payload = {id: user.id, login: user.login};
		return (this.jwtService.signAsync(payload));
	}

}
