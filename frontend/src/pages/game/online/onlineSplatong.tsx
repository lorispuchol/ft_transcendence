import { useEffect, useRef, useState } from "react";
import "../Game.scss";
import handlePaddle, { Pad, drawPaddle, handleKey, init_paddle } from "./paddle";
import { Ball, drawBall, init_ball } from "../local/ball";
import { countDown } from "./countDown";
import collision, { clamp } from "./collision";
import DisplayWinner from "./winner";

export interface ScreenSize {
	w: number,
	h: number
}

export const p1Color = "orange";
export const p2Color = "cyan";

function colorTomatrix(color: string) {
	switch (color)
	{
		case p1Color:
			return 1;
		case p2Color:
			return 2;
		default:
			return 0;
	}
}

export default function OnlineSplatong( { socket, setScore, side }: any ) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [winnerId, setWinnerId]: [number, Function] = useState(-1);
	const [clock, setClock]: [number | null, Function] = useState(null);
	
	useEffect(() => {
		setWinnerId(-1);

		const gameDuration: number = 30;
		setScore({p1: 0, p2: 0});

		const ctx = canvasRef!.current!.getContext('2d')!;
		const screen = {w: 3200, h: 1800}
		ctx.canvas.width = screen.w;
		ctx.canvas.height = screen.h;

		const [idKey] = handleKey();
		const ball : Ball = init_ball(screen);
		ball.speedCap = 45;
		const paddle: Pad = init_paddle(screen, side);
		if (side === 1)
		{
			paddle.ownColor = p1Color;
			paddle.opColor = p2Color;
		}
		else
		{
			paddle.ownColor = p2Color;
			paddle.opColor = p1Color;
		}
		let opponentKey: string = "";

		const cell: number = 25;
		const cellSize: {w: number, h: number} = {w: screen.w / cell, h: screen.h / cell};
		const background: number[][] = Array.from({length: cell}, () => Array.from({length: cell}, () => 0));
		
		let animationFrameId: number = 0;
		let nextRoundTime: number = 0;
		let endTime: number;
		let timer: number = 0;
		let now: number = 0;

		function drawBackground() {
			let x: number = 0;
			let y: number = 0;
			let color: number = 0;
			while (x < cell)
			{
				y = 0;
				while (y < cell)
				{
					color = background[y][x]
					if (color === 1)
						ctx.fillStyle = p1Color;
					else if (color === 2)
						ctx.fillStyle = p2Color;
					else
						ctx.fillStyle = "white";	
					ctx.fillRect(x * cellSize.w, y * cellSize.h, cellSize.w, cellSize.h);
					y++;
				}
				x++;
			}
		}

		function updateState(state: any) {
			ball.color = state.ballColor === 1 ? p1Color : p2Color;
			opponentKey = state.opponentKey;
			paddle.opY = state.opponentPos;
			ball.x = state.ballX;
			ball.y = state.ballY;
			ball.dx = state.ballDx;
			ball.dy = state.ballDy;
		}
		socket.on("GameState", updateState);

		function updateOwnPos(ownPos: number) {
			paddle.ownY = ownPos;
		}
		socket.on("ownPos", updateOwnPos);

		function roundStart(startTime: number) {
			nextRoundTime = startTime;
			endTime = nextRoundTime + gameDuration * 1000;
			now = Date.now();
			timer = nextRoundTime - now;
			animationFrameId = window.requestAnimationFrame(renderStart);
		}
		socket.on("roundStart", roundStart);
		
		function gameEnd(endData: {winner: number, p1Score: number, p2Score: number}) {
			window.cancelAnimationFrame(animationFrameId);
			console.log()
			setClock(null);
			setWinnerId(endData.winner);
			setScore({p1: endData.p1Score, p2: endData.p2Score});
		}
		socket.on("end", gameEnd);

		function renderStart() {
			drawBackground();
			countDown(ctx, now, timer);
			drawPaddle(ctx, paddle);
			drawBall(ctx, ball);
			if (nextRoundTime <= Date.now())
				animationFrameId = window.requestAnimationFrame(render);
			else
				animationFrameId = window.requestAnimationFrame(renderStart);
		}

		const widthRatio = 1 / cellSize.w;
		const heighRatio = 1 / cellSize.h;
		function xMatrix() {return (clamp(Math.floor(ball.x * widthRatio), 0, cell - 1))}
		function yMatrix() {return (clamp(Math.floor(ball.y * heighRatio), 0, cell - 1))}

		function render() {
			drawBackground();
			handlePaddle(ctx, paddle, opponentKey, socket);
			ball.color = collision(screen, side, paddle, ball);
			drawBall(ctx, ball);
			background[yMatrix()][xMatrix()] = colorTomatrix(ball.color);
			setClock(Math.round((endTime - Date.now()) * 0.001))
			animationFrameId = window.requestAnimationFrame(render);
		}
	
		return (() => {
			socket.off("GameState", updateState);
			socket.off("ownPos", updateOwnPos);
			socket.off("roundStart", roundStart);
			socket.off("end", gameEnd);
			window.cancelAnimationFrame(animationFrameId);
			document.removeEventListener("keydown", idKey[0]);
			document.removeEventListener("keyup", idKey[1]);
		});
	}, [setScore, socket, side, setWinnerId]);

	return (
			<div className="canvas_container">
				<div className="prompt_wrapper z-[3]">
					<div className="get_ready">{clock}</div>
				<DisplayWinner winnerId={winnerId} />
				</div>
				<canvas id="pong" ref={canvasRef} className="classique"/>
			</div>
	);
}