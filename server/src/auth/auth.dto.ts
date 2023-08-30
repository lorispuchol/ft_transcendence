import { IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength, Validate } from "class-validator";
import { IsUsernameAvailable, PasswordMatch } from "./auth.decorator";

export class NewUserWithPassword {
	
	@IsNotEmpty()
	@IsString()
	@MaxLength(16)
	@MinLength(2)
	@Validate(IsUsernameAvailable)
	username: string;

	@IsNotEmpty()
	@IsString()
	@IsStrongPassword({minLength: 8, minLowercase: 1, minNumbers: 1, minUppercase: 1, minSymbols: 0})
	password: string;
}

export class UserWithPassword {
	
	@IsNotEmpty()
	@IsString()
	@MaxLength(16)
	username: string;

	@IsNotEmpty()
	@IsString()
	@Validate(PasswordMatch)
	password: string;
}
