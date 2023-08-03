import { IsNotEmpty, Validate } from "class-validator";
import { IsUsernameAvailable } from "./auth.decorator";

export class UserWithPassword {
	
	@IsNotEmpty()
	@Validate(IsUsernameAvailable)
	username: string;

	@IsNotEmpty()
	password: string;
}