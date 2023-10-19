import { Controller, Get, Param } from "@nestjs/common";
import { GameService } from "./game.service";
import { Match } from "./match.entity";
import { Public } from "src/auth/constants";

@Controller('game')
export class GameController {
	constructor(
		private gameService: GameService,
	) {}

	@Public()
	@Get('history/:id')
	async getMatchHistory(@Param('id') userId: number) {
		const matchs: Match[] = await this.gameService.getMatchHistory(userId);
		return matchs;
	}
}
