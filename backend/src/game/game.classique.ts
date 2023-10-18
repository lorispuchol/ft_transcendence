import { Socket } from "socket.io";
import { MatchInfo } from "./game.service";

interface ScreenSize {
	w: number,
	h: number
}

interface Pad {
	w: number,
	h: number,
	speed: number,
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

enum padSide {
	P1 = 1,
	P2 = -1
}

// @ts-ignore
interface State {
	opponentKey: string,
	opponentPos: number,
	ballX: number,
	ballY: number,
	ballDx: number,
	ballDy: number,
}

export default class PongGame {
	constructor(
		private p1: number,
		private socketP1: Socket,
		private p2: number,
		private socketP2: Socket,
	) {}

	private intervalId: NodeJS.Timer;
	private timeoutId: NodeJS.Timeout;

	private inputP1: string  = "";
	private inputP2: string = "";
	private scoreP1: number = 0;
	private scoreP2: number = 0;
	
	private screen: ScreenSize = {w: 3200, h:1800};
	private borderGap: number = this.screen.h * 0.006;
	private winningScore: number = 3;

	private winner: number = 0;
	private gameEnded: boolean = false;

	private paddles: Pad = this.init_paddle();
	private ball: Ball = this.init_ball(this.screen);

	public start() {
		this.clear();
		const perSec = 1000 / 60;
		const startDelay = 1000;
		const startTime: number = Date.now() + startDelay;
		this.socketP1.emit("roundReset", {scoreP1: this.scoreP1, scoreP2: this.scoreP2, nextRound: startTime});
		this.socketP2.emit("roundReset", {scoreP1: this.scoreP1, scoreP2: this.scoreP2, nextRound: startTime});
		if (this.checkWinner())
			return ;
		this.timeoutId = setTimeout(() => {
			this.intervalId = setInterval(() => this.update(this), perSec);
		}, startDelay);
	}

	private update(self: this) {
		self.movement(self.paddles);
		self.collision();
		self.handleBall(self.ball);
		if (self.checkPoint())
			return ;
		self.sendState();
	}

	public clear() {
		clearInterval(this.intervalId);
		clearTimeout(this.timeoutId);
	}

	public matchInfo(): MatchInfo {
		if (this.winner === this.p1)
			return ({
				mode: "classic",
				winnerId: this.p1,
				loserId: this.p2,
				winnerScore: this.scoreP1,
				loserScore: this.scoreP2,
			});
		
		return ({
			mode: "classic",
			winnerId: this.p2,
			loserId: this.p1,
			winnerScore: this.scoreP2,
			loserScore: this.scoreP1,
		});
	}

	//////////////SOCKET//////////////

	private sendState() {
		const state = {
			ballX: this.ball.x,
			ballY: this.ball.y,
			ballDx: this.ball.dx,
			ballDy: this.ball.dy
		}
		this.socketP1.emit("GameState", {opponentKey: this.inputP2, opponentPos: this.paddles.p2y, ...state});
		this.socketP2.emit("GameState", {opponentKey: this.inputP1, opponentPos: this.paddles.p1y, ...state});
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
				if (!this.gameEnded)
					this.socketP2.emit("end", this.p2);
				return this.p2;
			case this.p2:
				if (!this.gameEnded)
					this.socketP1.emit("end", this.p1);
				return this.p1;
			default:
				return 0;
		}
	}

	//////////////GAME LOGIC//////////////
	
	private checkWinner() {
		if (this.scoreP1 != this.winningScore && this.scoreP2 != this.winningScore)
			return 0;
		this.gameEnded = true;

		if (this.scoreP1 === this.winningScore)
			this.winner = this.p1;
		else
			this.winner = this.p2;
		
		this.socketP1.emit("end", this.winner);
		this.socketP2.emit("end", this.winner);
		
		return 1;
	}

	private checkPoint() {
		const hitLeft = this.ball.x <= this.ball.rad;
		const hitRight = this.ball.x >= (this.screen.w - this.ball.rad);
	
		if (!hitLeft && !hitRight)
			return 0;
		this.scoreP1 += +hitRight; 
		this.scoreP2 += +hitLeft;
		Object.assign(this.paddles, this.init_paddle());
		Object.assign(this.ball, this.init_ball(this.screen));
		this.start();
		return 1;
	}

	//PADDLE
	private movement(pad: Pad) {	
		if (this.inputP1 === "ArrowUp" && pad.p1y >= this.borderGap)
			pad.p1y -= pad.speed;
		else if (this.inputP1 === "ArrowDown" && pad.p1y <= this.screen.h - pad.h - this.borderGap)
			pad.p1y += pad.speed;
		
		if (this.inputP2 === "ArrowUp" && pad.p2y >= this.borderGap)
			pad.p2y -= pad.speed;
		else if (this.inputP2 === "ArrowDown" && pad.p2y <= this.screen.h - pad.h - this.borderGap)
			pad.p2y += pad.speed;
	}

	private init_paddle() {
		const w = this.screen.w * 0.01;
		const h = this.screen.h * 0.15;
		const speed: number = this.screen.h * 0.02;
	
		const p1x = this.screen.w * 0.1 - w * 0.5;
		const p1y = this.screen.h * 0.5 - h * 0.5;
	
		const p2x = this.screen.w * 0.9 - w * 0.5;
		const p2y = this.screen.h * 0.5 - h * 0.5;
	
		return {w, h, speed, p1x, p1y, p2x, p2y};
	}

	//BALL
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

	handleBall (ball: Ball) {
		ball.x += ball.dx * ball.speed;
		ball.y += ball.dy * ball.speed;
	}

	//COLLISION
	private clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

	private bounce(side: padSide, ball: Ball, ph: number, py:number) {
		let angle = -Math.PI * 0.5;
		let collidePoint = (ball.y - py) / ph;
		collidePoint = this.clamp(collidePoint, 0, 1);
		angle += (collidePoint * (Math.PI * -0.2) + Math.PI * 0.1);

		if (ball.speed < 70)
			ball.speed += ball.acc;
		ball.dx =  Math.abs(Math.sin(angle)) * side;
		ball.dy = -Math.cos(angle);
	}

	private paddleHit(pad: Pad, ball: Ball) {

		function hit(px: number, py: number) {
			const distX = Math.abs(ball.x - px - pad.w * 0.5);
			const distY = Math.abs(ball.y - py - pad.h * 0.5);	

			if (distX > (pad.w * 0.5 + ball.rad)) { return false; }
			if (distY > (pad.h * 0.5 + ball.rad)) { return false; }
		
			if (distX <= (pad.w * 0.5)) { return true; } 
			if (distY <= (pad.h * 0.5)) { return true; }
		
			const dx = distX - pad.w * 0.5;
			const dy = distY - pad.h * 0.5;
			return (dx*dx + dy*dy <= ball.rad ** 2);
		}
		if (hit(pad.p1x, pad.p1y))
			this.bounce(padSide.P1, ball, pad.h, pad.p1y);	
		else if (hit(pad.p2x, pad.p2y))
			this.bounce(padSide.P2, ball, pad.h, pad.p2y);
	}

	private collision() {
		this.paddleHit(this.paddles, this.ball);
		if (this.ball.y >= (this.screen.h - this.ball.rad) || this.ball.y <= this.ball.rad)
			this.ball.dy *= -1;
		if (this.ball.x >= (this.screen.w - this.ball.rad) || this.ball.x <= this.ball.rad)
			this.ball.dx *= -1;
	}
}
