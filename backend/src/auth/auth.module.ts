import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { jwtConstants } from "./constants";
import { AlreadyHere, IsUsernameAvailable, PasswordMatch } from "./auth.decorator";
import { EventModule } from "src/event/event.module";

@Module({
	imports : [
		UserModule,
		EventModule,
		JwtModule.register({
				global: true,
				secret: jwtConstants.secret,
				signOptions: { expiresIn: jwtConstants.expire },
		})
	],
	controllers: [AuthController],
	providers: [AuthService, IsUsernameAvailable, PasswordMatch, AlreadyHere],
	exports: [AuthService],
})
export class AuthModule {}
