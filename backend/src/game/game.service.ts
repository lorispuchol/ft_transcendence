import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";

interface ScreenSize {
	w: number,
	h: number
}

interface Pad {
	w: number,
	h: number,
	p1x: number,
	p1y: number,
	p2x: number,
	p2y: number,
}

interface Ball {
	x : number,
	y : number,
	rad: number,
	dx : number,
	dy : number,
	speed : number,
	acc: number,
}

interface State {
	openentKey: string,
	openentPos: number,
	ballX: number,
	ballY: number,
	ballDx: number,
	ballDy: number,
}

export class PongGame {
	constructor(
		private p1: number,
		private socketP1: Socket,
		private p2: number,
		private socketP2,
	) {}

	private inputP1: string  = "";
	private inputP2: string = "";

	static screen: ScreenSize = {w: 3200, h:1800};
	private paddles: Pad = this.init_paddle();
	private ball: Ball = this.init_ball(PongGame.screen);

	public start() {
		performance.now();
		const perSec = 6000 / 60;
		setInterval(this.update, perSec)
	}

	private update() {
		this.sendState();
	}

	private sendState() {
		const state = {
			ballX: this.ball.x,
			ballY: this.ball.y,
			ballDx: this.ball.dx,
			ballDy: this.ball.dy
		}
		this.socketP1.emit("GameState", {openentKey: this.inputP2, openentPos: this.paddles.p2y, ...state});
		this.socketP2.emit("GameState", {openentKey: this.inputP1, openentPos: this.paddles.p1y, ...state});
	}

	public input(id: number, input: string) {
		switch(id) {
			case this.p1:
				this.inputP1 = (input);
				return 0;
			case this.p2:
				this.inputP2 = (input);
				return 0;
			default:
				return 1;
		}
	}

	public handleDisconnect(id: number) {
		switch(id) {
			case this.p1:
				this.socketP2.emit("end", "player1");
				return this.p2;
			case this.p2:
				this.socketP1.emit("end", "player2");
				return this.p1;
			default:
				return 1;
		}
	}

	private init_paddle() {
		const w = PongGame.screen.w * 0.01;
		const h = PongGame.screen.h * 0.15;
	
		const p1x = PongGame.screen.w * 0.9 - w * 0.5;
		const p1y = PongGame.screen.h * 0.5 - h * 0.5;
	
		const p2x = PongGame.screen.w * 0.1 - w * 0.5;
		const p2y = PongGame.screen.h * 0.5 - h * 0.5;
	
		return {w, h, p1x, p1y, p2x, p2y};
	}

	private rng(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1) ) + min;
	}

	private init_ball(screen: ScreenSize) {
		const x = screen.w * 0.5;
		const y = screen.h * 0.5;
		const rad = 0.5 * Math.sqrt(screen.w * screen.w + screen.h * screen.h) * 0.015;
	
		const collidePoint = this.rng(0, 100) / 100;
		const angle = -Math.PI * 0.5 + (collidePoint * (Math.PI * -0.2) + Math.PI * 0.2);
	
		const dx = Math.sin(angle) * (this.rng(0, 1)? 1 : -1);
		const dy = -Math.cos(angle);
		const speed = 15;
		const acc = 4;
	
		return {x, y, rad, dx, dy, speed, acc};
	}
}

@Injectable()
export class GameService {

}
