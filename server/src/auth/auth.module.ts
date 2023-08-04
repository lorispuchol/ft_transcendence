import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { jwtConstants } from "./constants";
import { IsUsernameAvailable } from "./auth.decorator";

@Module({
	imports : [
		UserModule,
		JwtModule.register({
				global: true,
				secret: jwtConstants.secret,
				signOptions: { expiresIn: jwtConstants.expire },
		})
	],
	controllers: [AuthController],
	providers: [AuthService, IsUsernameAvailable],
	exports: [AuthService],
})
export class AuthModule {}
