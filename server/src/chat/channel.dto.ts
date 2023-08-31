import { IsNotEmpty, IsNotIn, IsString, IsStrongPassword, MaxLength, MinLength, NotContains, Validate } from "class-validator";
import { IsChannelNameAvailable, PasswordChannelMatch } from "./channel.decorator";
import { Not } from "typeorm";

export class NewChannelWithPassword {
	
	@IsNotEmpty()
	@IsString()
	@MaxLength(33)
	@MinLength(2)
	@NotContains("+")
	@Validate(IsChannelNameAvailable)
	channelName: string;

	@IsNotEmpty()
	@IsString()
	@IsStrongPassword({minLength: 8, minLowercase: 1, minNumbers: 1, minUppercase: 1, minSymbols: 0})
	password: string;
}

export class NewChannelWithoutPassword {
	
	@IsNotEmpty()
	@IsString()
	@MaxLength(33)
	@MinLength(2)
	@NotContains("+")
	@Validate(IsChannelNameAvailable)
	channelName: string;
}

export class SetPasswordChannel {

	channelName: string;

	@IsNotEmpty()
	@IsString()
	@IsStrongPassword({minLength: 8, minLowercase: 1, minNumbers: 1, minUppercase: 1, minSymbols: 0})
	password: string;
}

export class JoinChannelWithPassword {

	channelName: string;

	@IsNotEmpty()
	@IsString()
	@Validate(PasswordChannelMatch)
	password: string;
}
