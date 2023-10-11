import { Module } from "@nestjs/common";
import { GameGateway } from "./game.gateway";
import { GameService } from "./game.service";
import { UserModule } from "src/user/user.module";

@Module({
	imports: [],
	providers: [GameGateway, GameService],
})
export class GameModule {}
