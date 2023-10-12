import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint } from "class-validator";
import * as bcrypt from 'bcrypt';
import { ChatService } from "./chat.service";
import { ChanMode, Channel } from "./entities/channel.entity";

@ValidatorConstraint({ async: true })
@Injectable()
export class IsChannelNameAvailable {
	constructor(
		private chatService: ChatService,
	) {}

	async validate(value: string) {
		const channel: Channel = await this.chatService.findChanByName(value);
		if (channel)
		 	return (false);
		return true
	}

	defaultMessage(args: ValidationArguments) {
		return `Channel name ${(args.object as any).channelName} is not available`;
	}
}

@ValidatorConstraint({ async: true })
@Injectable()
export class PasswordChannelMatch {
	constructor(
		private chatService: ChatService,
	) {}

	async validate(value: string, args: ValidationArguments) {
		const log: any = args.object;
		const channel: Channel = await this.chatService.findChanByName(log.channelName);
		if (!channel)
			return false;

		const isMatch = await bcrypt.compare(log.password, channel.password);
		if (!isMatch)
			return false;
		return true;
	}

	defaultMessage(args: ValidationArguments) {
		return "unknow channel name or wrong password";
	}
}