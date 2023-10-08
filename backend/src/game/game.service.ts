import { Injectable } from "@nestjs/common";

export class PongGame {
	constructor(
		private p1: string,
		private p2: string,
	) {}

	start() {
		
	}
}

@Injectable()
export class GameService {

}
