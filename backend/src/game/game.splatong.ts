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
	speedCap: number,
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

export default class Splatong {
	constructor(
		private p1: number,
		private socketP1: Socket,
		private p2: number,
		private socketP2: Socket,
	) {}

	public spectator: Socket[] = [];

	private p1Ready: boolean = false;
	private p2Ready: boolean = false;

	private intervalId: NodeJS.Timer;
	private ownPosIntervalId: NodeJS.Timer;
	private endIntervalId: NodeJS.Timer;
	private timeoutId: NodeJS.Timeout;

	private inputP1: string  = "";
	private inputP2: string = "";
	private scoreP1: number = 0;
	private scoreP2: number = 0;

	private screen: ScreenSize = {w: 3200, h:1800};
	private borderGap: number = this.screen.h * 0.006;

	private winner: number = 0;
	private gameEnded: boolean = false;

	private gameDuration: number = 30;
	private endTime: number = 0;
	private coinflipLoser: number;
	
	private p1Cell = 1;
	private p2Cell = 2;
	private currentCell = 0;
	private cell: number = 25;
	private cellSize: {w: number, h: number} = {w: this.screen.w / this.cell, h: this.screen.h / this.cell};
	private background: number[][] = Array.from({length: this.cell}, () => Array.from({length: this.cell}, () => 0));

	private paddles: Pad = this.init_paddle();
	private ball: Ball = this.init_ball(this.screen);

	public ready(userId: number) {
		if (userId === this.p1)
			this.p1Ready = true;
		else if (userId === this.p2)
			this.p2Ready = true;

		if (this.p1Ready && this.p2Ready)
		{
			this.p1Ready = this.p2Ready = false;
			this.start();
		}
	}


	private start() {
		const perSec = 1000 / 60;
		const startDelay = 1000;
		const startTime: number = Date.now() + startDelay;
		this.endTime = startTime + this.gameDuration * 1000;
		this.socketP1.emit("roundStart", startTime);
		this.socketP2.emit("roundStart", startTime);
		this.timeoutId = setTimeout(() => {
			this.intervalId = setInterval(() => this.update(this), perSec);
		}, startDelay);
		this.ownPosIntervalId = setInterval(() => this.sendOwnPos(), 1000);
		this.endIntervalId = setInterval(() => {this.checkEnd()}, 1000)
	}

	private widthRatio = 1 / this.cellSize.w;
	private heighRatio = 1 / this.cellSize.h;
	private xMatrix() {return (this.clamp(Math.floor(this.ball.x * this.widthRatio), 0, this.cell - 1))}
	private yMatrix() {return (this.clamp(Math.floor(this.ball.y * this.heighRatio), 0, this.cell - 1))}

	private update(self: this) {
		self.movement(self.paddles);
		self.collision();
		self.handleBall(self.ball);
		self.background[this.yMatrix()][this.xMatrix()] = self.currentCell;
		self.sendState();
	}

	public clear() {
		clearInterval(this.intervalId);
		clearInterval(this.ownPosIntervalId);
		clearInterval(this.endIntervalId);
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
			ballColor: this.currentCell,
			ballX: this.ball.x,
			ballY: this.ball.y,
			ballDx: this.ball.dx,
			ballDy: this.ball.dy
		}
		this.socketP1.emit("GameState", {opponentKey: this.inputP2, opponentPos: this.paddles.p2y, ...state});
		this.socketP2.emit("GameState", {opponentKey: this.inputP1, opponentPos: this.paddles.p1y, ...state});
		this.spectator.forEach((socket: Socket) => {
			socket.emit("GameState", {ownPos: this.paddles.p1y,
				 opponentKey: this.inputP2, opponentPos: this.paddles.p2y, ...state});
		})
	}

	private sendOwnPos() {
		this.socketP1.emit("ownPos", this.paddles.p1y);
		this.socketP2.emit("ownPos", this.paddles.p2y);
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
					this.sendWinner(this.p2);
				return this.p2;
			case this.p2:
				if (!this.gameEnded)
					this.sendWinner(this.p1);
				return this.p1;
			default:
				return 0;
		}
	}

	public sendBackground(socket: Socket) {
		socket.emit("updateBackground", this.background);
	}

	public getInfo() {
		return {p1: this.p1, scoreP1: this.scoreP1, p2: this.p2, scoreP2: this.scoreP2, mode: "splatong"};
	}

	//////////////GAME LOGIC//////////////
	
	private checkEnd() {
		if (this.endTime <= Date.now())
		{
			this.clear();
			this.gameEnded = true;
			this.sendWinner();
		}
	}

	private sendWinner(winnerByDeco?: number) {
		let p1Score: number = 0;
		let p2Score: number = 0;
		let color: number = 0;
	
		let x: number = 0;
		let y: number = 0;
		while (x < this.cell)
		{
			y = 0;
			while (y < this.cell)
			{
				color = this.background[y][x]
				if (color === this.p1Cell)
					p1Score++;
				else if (color === this.p2Cell)
					p2Score++;	
				y++;
			}
			x++;
		}

		if (winnerByDeco)
			this.winner = winnerByDeco;
		else if (p1Score > p2Score)
			this.winner = this.p1;
		else if (p2Score > p1Score)
			this.winner = this.p2;
		else
			this.winner = this.coinflipLoser;

		this.scoreP1 = Math.floor(p1Score / (this.cell * this.cell / 100));
		this.scoreP2 = Math.floor(p2Score / (this.cell * this.cell / 100));
		const result = {winner: this.winner, p1Score: this.scoreP1, p2Score: this.scoreP2}
	
		this.socketP1.emit("end", result);
		this.socketP2.emit("end", result);

		this.spectator.forEach((socket: Socket) => {
			socket.emit("end", result);
		})

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
		if (dx < 0)
			this.coinflipLoser = this.p2;
		else
			this.coinflipLoser = this.p1;
		const dy = -Math.cos(angle);
		const speedCap = 45;
		const speed = 15;
		const acc = 4;
	
		return {x, y, rad, dx, dy, speedCap, speed, acc};
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

		if (ball.speed < ball.speedCap)
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
		{
			this.bounce(padSide.P1, ball, pad.h, pad.p1y);
			this.currentCell = this.p1Cell;
		}
		else if (hit(pad.p2x, pad.p2y))
		{
			this.bounce(padSide.P2, ball, pad.h, pad.p2y);
			this.currentCell = this.p2Cell;
		}
	}

	private collision() {
		this.paddleHit(this.paddles, this.ball);
		if (this.ball.y >= (this.screen.h - this.ball.rad) || this.ball.y <= this.ball.rad)
			this.ball.dy *= -1;
		if (this.ball.x >= (this.screen.w - this.ball.rad) || this.ball.x <= this.ball.rad)
			this.ball.dx *= -1;
	}
}
