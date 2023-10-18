import { Module } from "@nestjs/common";
import { GameGateway } from "./game.gateway";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Match } from "./match.entity";
import { UserModule } from "src/user/user.module";
import { GameService } from "./game.service";
import { GameController } from "./game.controller";

@Module({
	imports: [
		TypeOrmModule.forFeature([Match], 'lorisforever'),
		UserModule
	],
	controllers: [GameController],
	providers: [GameGateway, GameService],
})
export class GameModule {}
