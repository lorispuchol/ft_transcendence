import { IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength, NotContains, Validate } from "class-validator";
import { IsChannelNameAvailable, IsMode, PasswordChannelMatch } from "./channel.decorator";
import { ChanMode } from "./entities/channel.entity";

export class NewChannelWithoutPassword {
	
	@IsNotEmpty()
	@IsString()
	@MaxLength(33)
	@MinLength(2)
	@NotContains("+")
	@Validate(IsChannelNameAvailable)
	channelName: string;
	
	@Validate(IsMode)
	mode: ChanMode;
}

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

	@Validate(IsMode)
	mode: ChanMode;
}
export class SetPasswordChannel {

	@IsNotEmpty()
	@IsString()
	@MaxLength(33)
	@MinLength(2)
	@NotContains("+")
	channelName: string;

	@IsNotEmpty()
	@IsString()
	@IsStrongPassword({minLength: 8, minLowercase: 1, minNumbers: 1, minUppercase: 1, minSymbols: 0})
	password: string;
}

export class JoinChannelWithPassword {

	@IsNotEmpty()
	@IsString()
	@MaxLength(33)
	@MinLength(2)
	@NotContains("+")
	channelName: string;

	@IsNotEmpty()
	@IsString()
	@Validate(PasswordChannelMatch)
	password: string;
}
