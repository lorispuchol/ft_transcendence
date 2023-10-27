import { useEffect, useRef, useState } from "react";
import "../Game.scss";
import handlePaddle, { Pad, clearBehind, drawPaddle, handleKey, init_paddle } from "./paddle";
import { Ball, drawBall, init_ball } from "../local/ball";
import { countDown } from "./countDown";
import collision from "./collision";
import DisplayWinner from "./winner";

export interface ScreenSize {
	w: number,
	h: number
}

export default function OnlineGame( { socket, setScore, side }: any ) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [winnerId, setWinnerId]: [number, Function] = useState(-1);
	
	useEffect(() => {
		setWinnerId(-1);
		const ctx = canvasRef!.current!.getContext('2d')!;
		const screen = {w: 3200, h: 1800};
		ctx.canvas.width = screen.w;
		ctx.canvas.height = screen.h;
		const idKey = handleKey();
		const ball : Ball = init_ball(screen);
		const paddle: Pad = init_paddle(screen, side);
		let opponentKey: string = "";
		
		let animationFrameId: number = 0;
		let nextRoundTime: number = 0;
		let timer: number = 0;
		let now: number = 0;

		function updateState(state: any) {
			opponentKey = state.opponentKey;
			paddle.opY = state.opponentPos;
			ball.x = state.ballX;
			ball.y = state.ballY;
			ball.dx = state.ballDx;
			ball.dy = state.ballDy;
			
			if (state.ownPos) //true for spectator
				paddle.ownY = state.ownPos;
		}
		socket.on("GameState", updateState);

		function updateOwnPos(ownPos: number) {
			paddle.ownY = ownPos;
		}
		socket.on("ownPos", updateOwnPos);

		function roundReset(data: any) {
			window.cancelAnimationFrame(animationFrameId);
			nextRoundTime = data.nextRound;
			setScore({p1: data.scoreP1, p2: data.scoreP2});
			Object.assign(paddle, init_paddle(screen, side));
			Object.assign(ball, init_ball(screen));
			now = Date.now();
			timer = nextRoundTime - now;
			animationFrameId = window.requestAnimationFrame(renderStart);
		}
		socket.on("roundReset", roundReset);
		
		function gameEnd(winner: number) {
			window.cancelAnimationFrame(animationFrameId);
			setWinnerId(winner);
		}
		socket.on("end", gameEnd);

		function renderStart() {
			ctx.clearRect(0,0,screen.w, screen.h);
			countDown(ctx, now, timer);
			drawPaddle(ctx, paddle);
			drawBall(ctx, ball);
			if (nextRoundTime <= Date.now())
				if (side === 0)
					animationFrameId = window.requestAnimationFrame(renderSpectate);
				else
					animationFrameId = window.requestAnimationFrame(render);
			else
				animationFrameId = window.requestAnimationFrame(renderStart);
		}

		function render() {
			ctx.clearRect(0,0, screen.w, screen.h);
			handlePaddle(ctx, paddle, opponentKey, socket);
			collision(screen, side, paddle, ball);
			drawBall(ctx, ball);
			clearBehind(ctx, paddle, side);
			animationFrameId = window.requestAnimationFrame(render);
		}
		
		function renderSpectate() {
			ctx.clearRect(0,0, screen.w, screen.h);
			drawPaddle(ctx, paddle);
			drawBall(ctx, ball);
			clearBehind(ctx, paddle, side);
			animationFrameId = window.requestAnimationFrame(renderSpectate);
		}

		if (side === 0)
			animationFrameId = window.requestAnimationFrame(renderSpectate);
		else
			socket.emit("ready");

		return (() => {
			socket.off("GameState", updateState);
			socket.off("ownPos", updateOwnPos);
			socket.off("roundReset", roundReset);
			socket.off("end", gameEnd);
			window.cancelAnimationFrame(animationFrameId);
			document.removeEventListener("keydown", idKey[0]);
			document.removeEventListener("keyup", idKey[1]);
		});
	}, [setScore, socket, side, setWinnerId]);

	return (
			<div className="canvas_container">
				<div className="prompt_wrapper z-[3]">
					<DisplayWinner winnerId={winnerId} />
				</div>
				<canvas id="pong" ref={canvasRef} className="classique"/>
			</div>
	);
}