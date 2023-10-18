import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "src/user/user.service";
import { Match } from "./match.entity";
import { Repository } from "typeorm";
import { User } from "src/user/user.entity";

export interface MatchInfo {
	mode: string,
	user1Id: number,
	user2Id: number,
	user1_score: number,
	user2_score: number,
}

@Injectable()
export class GameService {
	constructor(
		@InjectRepository(Match, 'lorisforever')
			private matchRepository: Repository<Match>,
		private userService: UserService,
	) {}

	async getMatchHistory(userId: number): Promise<any> {
		const match: Match[] | null = await this.userService.findUserMatches(userId);
		if (!match)
			return [];
		return match;
	}

	async addNewMatch(matchInfo: MatchInfo) {
		const user1: User = await this.userService.findOneById(matchInfo.user1Id);
		const user2: User = await this.userService.findOneById(matchInfo.user2Id);
		if (!user1 || !user2)
		{
			console.log("error addNewMatch: user not found");
			return ;
		}
		this.createMatch(matchInfo.mode, user1, user2, matchInfo.user1_score, matchInfo.user2_score);
		this.createMatch(matchInfo.mode, user2, user1, matchInfo.user2_score, matchInfo.user1_score);
	}

	createMatch(mode: string, user: User, opponent: User, userScore: number, opponentScore: number) {
		const match: Match = new Match();

		match.user = user;
		match.opponent = opponent;
		match.mode = mode;
		match.user_score = userScore;
		match.opponent_score = opponentScore;

		this.matchRepository.save(match);
	}
}
