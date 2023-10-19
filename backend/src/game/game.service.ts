import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "src/user/user.service";
import { Match } from "./match.entity";
import { Repository } from "typeorm";
import { User } from "src/user/user.entity";

export interface MatchInfo {
	mode: string,
	winnerId: number,
	loserId: number,
	winnerScore: number,
	loserScore: number,
}

@Injectable()
export class GameService {
	constructor(
		@InjectRepository(Match, 'lorisforever')
			private matchRepository: Repository<Match>,
		private userService: UserService,
	) {}

	private userInGame: number[] = [];

	updateUserInGame(newUserInGame: number[]) {
		this.userInGame = newUserInGame;
		console.log(this.userInGame);
	}

	getUserInGame(userId: number) {
		if (this.userInGame.indexOf(userId) !== -1)
			return true;
		return false;
	}

	async getMatchHistory(userId: number): Promise<any> {
		const match: Match[] | null = await this.userService.findUserMatches(userId);
		if (!match)
			return [];
		return match;
	}

	async addNewMatch(matchInfo: MatchInfo) {
		const winner: User = await this.userService.findOneById(matchInfo.winnerId);
		const loser: User = await this.userService.findOneById(matchInfo.loserId);
		if (!winner || !loser)
		{
			console.log("error addNewMatch: user not found");
			return ;
		}

		this.userService.addWin(winner.id);
		this.userService.addDefeat(loser.id);

		this.createMatch(matchInfo.mode, winner, loser, matchInfo.winnerScore, matchInfo.loserScore);
	}

	createMatch(mode: string, winner: User, loser: User, winnerScore: number, loserScore: number) {
		const match: Match = new Match();

		match.winner = winner;
		match.loser = loser;
		match.mode = mode;
		match.winner_score = winnerScore;
		match.loser_score = loserScore;

		this.matchRepository.save(match);
	}
}
