import { IsNotEmpty, IsString, IsStrongPassword, Validate } from "class-validator";
import { IsUsernameAvailable } from "./auth.decorator";

export class UserWithPassword {
	
	@IsNotEmpty()
	@IsString()
	@Validate(IsUsernameAvailable)
	username: string;

	@IsNotEmpty()
	@IsString()
	@IsStrongPassword({minLength: 10, minLowercase: 1, minNumbers: 1, minUppercase: 1})
	password: string;
}