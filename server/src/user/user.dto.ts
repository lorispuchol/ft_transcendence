import { IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength, Validate } from "class-validator";
import { IsUsernameAvailable } from "src/auth/auth.decorator";

export class newUsername {
	@IsNotEmpty()
	@IsString()
	@MaxLength(16)
	@MinLength(2)
	@Validate(IsUsernameAvailable)
	username: string;
}
