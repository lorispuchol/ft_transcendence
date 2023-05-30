import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { jwtConstants } from "./constants";

@Module({
	imports : [
		UserModule,
		JwtModule.register({
				global: true,
				secret: jwtConstants.secret,
				signOptions: { expiresIn: '60s' },
		})
	],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthService],
})

export class AuthModule {}
