
import { useEffect, useRef, useState } from "react";
import "../Game.scss";
import handlePaddle, { Pad, handleKey, init_paddle } from "./paddle";
import handleBall, { Ball, drawBall, init_ball } from "../local/ball";
import collision from "../local/collision";
import { countDown } from "../local/countDown";
import { Players } from "../Game";
import { Button } from "@mui/material";

let freezeFrame = 0;

export interface ScreenSize {
	w: number,
	h: number
}

function checkPoint(changeScores: Function, score: any, ctx: CanvasRenderingContext2D, paddle: Pad, ball: Ball, side: number) {
	const hitLeft = ball.x <= ball.rad;
	const hitRight = ball.x >= (ctx.canvas.width - ball.rad);

	if (hitLeft || hitRight) {
		score.p1 += +hitRight; 
		score.p2 += +hitLeft;
		changeScores((prev: Players) => {
			return (
				{p1: {...prev.p1, score: score.p1},
				p2: {...prev.p2, score: score.p2}});
		});
		ball.color = "red"
		drawBall(ctx, ball);
		freezeFrame = 20;
		Object.assign(paddle, init_paddle({w: ctx.canvas.width, h: ctx.canvas.height}, side));
		Object.assign(ball, init_ball({w: ctx.canvas.width, h: ctx.canvas.height}));
		return true;
	}
	return false;
}

export default function OnlineGame( { socket, setPlayers, side }: any ) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [prompt, setPrompt]: [boolean, Function] = useState(true);
	const [winner, setWinner]: [string, Function] = useState("");
	const [leftReady, setLeftReady]: [string, Function] = useState("blinking");
	const [rightReady, setRightReady]: [string, Function] = useState("blinking");
	
	useEffect(() => {
		const ctx = canvasRef!.current!.getContext('2d')!;
		const screen = {w: 3200, h: 1800}
		ctx.canvas.width = screen.w;
		ctx.canvas.height = screen.h;
		const [idKey] = handleKey();
		const ball : Ball = init_ball(screen);
		const paddle: Pad = init_paddle(screen, side);
		let openentKey: string = "";
		
		let animationFrameId: number;
		let roundStart: boolean = true;
		let now = performance.now();
		const score = {p1:0, p2:0};

		function updateState(state: any) {
			// console.log(state);
			openentKey = state.openentKey;
			paddle.opY = state.openentPos;
			ball.x = state.ballX;
			ball.y = state.ballY;
			ball.dx = state.ballDx;
			ball.dy = state.ballDy;
		}
		socket.on("GameState", updateState);
		
		function gameEnd(winner: string) {
			window.cancelAnimationFrame(animationFrameId);
			setWinner(winner);
		}
		socket.on("end", gameEnd);

		// let ready: boolean[] = [false, false];
		// function renderReady() {
		// 	ctx.clearRect(0,0,screen.w, screen.h);
		// 	handlePaddleGetReady(ctx, paddle, ready, setLeftReady, setRightReady);
		// 	drawBall(ctx, ball);
		// 	if (ready[0] && ready[1])
		// 	{
		// 		setPrompt(false);
		// 		now = performance.now();
		// 		animationFrameId = window.requestAnimationFrame(render);
		// 		return;
		// 	}
		// 	animationFrameId = window.requestAnimationFrame(renderReady);
		// }

		function render() {
			// if (freezeFrame)
			// {
			// 	freezeFrame--;
			// 	now = performance.now();
			// }
			// else if (roundStart)
			// {
			// 	if (score.p1 >= 3 || score.p2 >= 3)
			// 	{
			// 		animationFrameId = window.requestAnimationFrame(renderEnd);
			// 		return ;
			// 	}
			// 	ctx.clearRect(0,0,screen.w, screen.h);
			// 	roundStart = countDown(ctx, now, 500);
			// 	handlePaddle(ctx, paddle, openentKey, socket);
			// 	drawBall(ctx, ball);
			// }
			// else {
			// 	ctx.clearRect(0,0, screen.w, screen.h);
			// 	handlePaddle(ctx, paddle, openentKey, socket);
			// 	//collision(screen, paddle, ball);
			// 	//handleBall(ctx, ball);
			// 	roundStart = checkPoint(setPlayers, score, ctx, paddle, ball, side);
			// }
			ctx.clearRect(0,0, screen.w, screen.h);
			handlePaddle(ctx, paddle, openentKey, socket);
			animationFrameId = window.requestAnimationFrame(render);
		}
		animationFrameId = window.requestAnimationFrame(render);
	
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
				{/* <div className={"prompt_wrapper" + (prompt ? "" : " fade")}>
					<h1 className="get_ready left-[23vw] top-[5vw]">GET READY</h1>
					<div className={"key kbd left-[10vw] top-[10vw] " + leftReady}>w</div>
					<div className={"key kbd left-[10vw] top-[25vw] " + leftReady}>s</div>
					<div className={"key kbd right-[10vw] top-[10vw] " + rightReady}>▲</div>
					<div className={"key kbd right-[10vw] top-[25vw] " + rightReady}>▼</div>
				</div> */}
				<canvas id="pong" ref={canvasRef} className="classique"/>
			</div>
	);
}