
import { useEffect, useRef, useState } from "react";
import "../Game.scss";
import handlePaddle, { Pad, clearBehind, drawPaddle, handleKey, init_paddle } from "./paddle";
import { Ball, drawBall, init_ball } from "../local/ball";
import { countDown } from "../local/countDown";
import { Players } from "../Game";
import collision from "./collision";

export interface ScreenSize {
	w: number,
	h: number
}

export default function OnlineGame( { socket, setPlayers, side }: any ) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [winner, setWinner]: [string, Function] = useState("");
	
	useEffect(() => {
		const ctx = canvasRef!.current!.getContext('2d')!;
		const screen = {w: 3200, h: 1800}
		ctx.canvas.width = screen.w;
		ctx.canvas.height = screen.h;
		const [idKey] = handleKey();
		const ball : Ball = init_ball(screen);
		const paddle: Pad = init_paddle(screen, side);
		let openentKey: string = "";
		
		let animationFrameId: number = 0;
		let nextRoundTime: number = 0;
		let timer: number = 0;
		let now = performance.now();

		function updateState(state: any) {
			openentKey = state.openentKey;
			paddle.opY = state.openentPos;
			ball.x = state.ballX;
			ball.y = state.ballY;
			ball.dx = state.ballDx;
			ball.dy = state.ballDy;
		}
		socket.on("GameState", updateState);

		function roundReset(data: any) {
			window.cancelAnimationFrame(animationFrameId);
			nextRoundTime = data.nextRound;
			setPlayers((prev: Players) => {
				return (
					{p1: {...prev.p1, score: data.scoreP1},
					p2: {...prev.p2, score: data.scoreP2}});
				});
			drawBall(ctx, ball);
			Object.assign(paddle, init_paddle(screen, side));
			Object.assign(ball, init_ball(screen));
			now = Date.now();
			timer = nextRoundTime - now;
			animationFrameId = window.requestAnimationFrame(renderStart);
		}
		socket.on("roundReset", roundReset);
		
		function gameEnd(winner: string) {
			window.cancelAnimationFrame(animationFrameId);
			setWinner(winner);
		}
		socket.on("end", gameEnd);

		function renderStart() {
			ctx.clearRect(0,0,screen.w, screen.h);
			countDown(ctx, now, timer);
			drawPaddle(ctx, paddle);
			drawBall(ctx, ball);
			if (nextRoundTime <= Date.now())
				animationFrameId = window.requestAnimationFrame(render);
			else
				animationFrameId = window.requestAnimationFrame(renderStart);
		}

		function render() {
			ctx.clearRect(0,0, screen.w, screen.h);
			handlePaddle(ctx, paddle, openentKey, socket);
			collision(screen, side, paddle, ball);
			drawBall(ctx, ball);
			clearBehind(ctx, paddle, side);
			animationFrameId = window.requestAnimationFrame(render);
		}
	
		return (() => {
			socket.off("GameState", updateState);
			socket.off("end", gameEnd);
			window.cancelAnimationFrame(animationFrameId);
			document.removeEventListener("keydown", idKey[0]);
			document.removeEventListener("keyup", idKey[1]);
		});
	}, [setPlayers, socket, side, setWinner]);

	return (
			<div className="canvas_container">
				<h1 className="get_ready left-[21vw] top-[20vw]">{winner}</h1>
				<canvas id="pong" ref={canvasRef} className="classique"/>
			</div>
	);
}