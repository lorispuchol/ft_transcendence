import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { GameService } from "./game.service";
import { Match } from "./match.entity";


@Controller('game')
export class GameController {
	constructor(
		private gameService: GameService,
	) {}

	@Get('history/:id')
	async getMatchHistory(@Param('id', ParseIntPipe) userId: number) {
		const matchs: Match[] = await this.gameService.getMatchHistory(userId);
		return matchs;
	}

	@Get('inGame/:id')
	getUserInGame(@Param('id', ParseIntPipe) userId: number) {
		return (this.gameService.getUserInGame(userId));
	}
}
