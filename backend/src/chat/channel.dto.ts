import { IsEnum, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength, NotContains, Validate } from "class-validator";
import { IsChannelNameAvailable, PasswordChannelMatch } from "./channel.decorator";
import { ChanMode } from "./entities/channel.entity";
import { MemberDistinc } from "./entities/participant_chan_x_user.entity";

export class NewChannelWithoutPassword {
	
	@IsNotEmpty()
	@IsString()
	@MaxLength(33)
	@MinLength(2)
	@NotContains("+")
	@Validate(IsChannelNameAvailable)
	channelName: string;
	
	@IsEnum(ChanMode)
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
	@MaxLength(30)
	password: string;

	@IsEnum(ChanMode)
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
	@Validate(PasswordChannelMatch)
	password: string;

	@IsNotEmpty()
	@IsString()
	@IsStrongPassword({minLength: 8, minLowercase: 1, minNumbers: 1, minUppercase: 1, minSymbols: 0})
	@MaxLength(30)
	newPw: string;
}

export class AddPwChan {

	@IsNotEmpty()
	@IsString()
	@IsStrongPassword({minLength: 8, minLowercase: 1, minNumbers: 1, minUppercase: 1, minSymbols: 0})
	@MaxLength(30)
	newPw: string;
}

export class RemovePwChannel {

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

	@IsEnum(ChanMode)
	mode: ChanMode;
}

export class ChangeModeChan {

	@IsEnum(ChanMode)
	mode: ChanMode;
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

export class Distinction {

	@IsString()
	@IsNotEmpty()
	@MaxLength(16)
	@MinLength(2)
	login: string;

	@IsEnum(MemberDistinc)
	distinction: MemberDistinc;
}

export class Mute {
	@IsString()
	@IsNotEmpty()
	@MaxLength(16)
	@MinLength(2)
	login: string;
}
