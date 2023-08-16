import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint } from "class-validator";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { ftConstants } from "./constants";
import axios from "axios";
import * as bcrypt from 'bcrypt';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUsernameAvailable {
	constructor(
		private userService: UserService,
	) {}

	async validate(value: string) {

		const userByLogin: User = await this.userService.findOneByLogin(value);
		if (userByLogin)
		 	return (false);
		const userByUsername: User = await this.userService.findOneByUsername(value);
		if (userByUsername)
		 	return (false);

		const data = {
			grant_type: "client_credentials",
			client_id: ftConstants.uid,
			client_secret: ftConstants.secret,
			redirect_uri: ftConstants.redirect_uri,
		};
		const getToken = await axios.post("https://api.intra.42.fr/oauth/token", data);
		const userData = await axios.get("https://api.intra.42.fr/v2/users?filter[login]=" + value, {
			headers: { Authorization:'Bearer ' + getToken.data.access_token }})
		const ftUser: any[] = userData.data;
		return (ftUser.length === 0);
	}

	defaultMessage(args: ValidationArguments) {
		return `${args.property} not available.`;
	}
}

@ValidatorConstraint({ async: true })
@Injectable()
export class Match {
	constructor(
		private userService: UserService,
	) {}

	async validate(value: string, args: ValidationArguments) {
		const user: User = await this.userService.findOneByUsername(value);
		if (!user)
			return false;

		const [relatedPropertyName] = args.constraints;
		const password = (args.object as any)[relatedPropertyName];
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch)
			return false;
	}

	defaultMessage(args: ValidationArguments) {
		return "unknow username or wrong password";
	}
}