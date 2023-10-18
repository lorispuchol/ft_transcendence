import { IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength, Validate } from "class-validator";
import { AlreadyHere, IsUsernameAvailable, PasswordMatch } from "./auth.decorator";

export class NewUserWithPassword {
	
	@IsNotEmpty()
	@IsString()
	@MaxLength(16)
	@MinLength(2)
	@Validate(IsUsernameAvailable)
	username: string;

	@IsNotEmpty()
	@IsString()
	@MaxLength(30)
	@IsStrongPassword({minLength: 8, minLowercase: 1, minNumbers: 1, minUppercase: 1, minSymbols: 0})
	password: string;
}

export class UserWithPassword {
	
	@IsNotEmpty()
	@IsString()
	@MaxLength(16)
	@Validate(AlreadyHere)
	username: string;

	@IsNotEmpty()
	@IsString()
	@MaxLength(30)
	@Validate(PasswordMatch)
	password: string;
}
