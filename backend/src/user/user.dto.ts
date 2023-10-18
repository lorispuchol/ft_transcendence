import { IsAlpha, IsNotEmpty, IsString, MaxLength, MinLength, Validate } from "class-validator";
import { IsUsernameAvailable } from "src/auth/auth.decorator";

export class newUsername {
	@IsNotEmpty()
	@IsString()
	@IsAlpha()
	@MaxLength(16)
	@MinLength(2)
	@Validate(IsUsernameAvailable)
	username: string;
}
