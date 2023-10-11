
import { useEffect, useRef, useState } from "react";
import "../Game.scss";
import handlePaddle, { Pad, clearBehind, handleKey, handlePaddleGetReady, init_paddle } from "./paddle";
import handleBall, { Ball, drawBall, init_ball } from "./ball";
import collision from "./collision";
import { countDown } from "./countDown";
import { Players } from "../Game";
import { ArrowDownward } from "@mui/icons-material";

let freezeFrame = 0;

export interface ScreenSize {
	w: number,
	h: number
}

function checkPoint(changeScores: Function, score: any, ctx: CanvasRenderingContext2D, paddle: Pad, ball: Ball) {
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
		Object.assign(paddle, init_paddle({w: ctx.canvas.width, h: ctx.canvas.height}));
		Object.assign(ball, init_ball({w: ctx.canvas.width, h: ctx.canvas.height}));
		return true;
	}
	return false;
}

export default function LocalGame( { setPlayers }: any ) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [prompt, setPrompt]: [boolean, Function] = useState(true);
	const [winner, setWinner]: [string, Function] = useState("");
	const [leftReady, setLeftReady]: [string, Function] = useState("blinking");
	const [rightReady, setRightReady]: [string, Function] = useState("blinking");
	
	useEffect(() => {
		setPlayers({p1: {score: 0, id: 0, username: "Player 1"}, p2: {score: 0, id: 0, username: "Player 2"}});
		const ctx = canvasRef!.current!.getContext('2d')!;
		const screen = {w: 3200, h: 1800}
		ctx.canvas.width = screen.w;
		ctx.canvas.height = screen.h;
		const [idKey] = handleKey();
		const ball : Ball = init_ball(screen);
		const paddle: Pad = init_paddle(screen);
		
		let animationFrameId: number;
		let roundStart: boolean = true;
		let now = performance.now();
		const score = {p1:0, p2:0};
		
		let ready: boolean[] = [false, false];
		function renderReady() {
			ctx.clearRect(0,0,screen.w, screen.h);
			handlePaddleGetReady(ctx, paddle, ready, setLeftReady, setRightReady);
			drawBall(ctx, ball);
			if (ready[0] && ready[1])
			{
				setPrompt(false);
				now = performance.now();
				animationFrameId = window.requestAnimationFrame(render);
				return;
			}
			animationFrameId = window.requestAnimationFrame(renderReady);
		}

		function renderEnd() {
			if (score.p1 === 3)
				setWinner("player 1 win");
			if (score.p2 === 3)
				setWinner("player 2 win");
		}

		function render() {
			if (freezeFrame)
			{
				freezeFrame--;
				now = performance.now();
			}
			else if (roundStart)
			{
				if (score.p1 >= 3 || score.p2 >= 3)
				{
					animationFrameId = window.requestAnimationFrame(renderEnd);
					return ;
				}
				ctx.clearRect(0,0,screen.w, screen.h);
				roundStart = countDown(ctx, now, 500);
				handlePaddle(ctx, paddle);
				drawBall(ctx, ball);
			}
			else {
				ctx.clearRect(0,0, screen.w, screen.h);
				handlePaddle(ctx, paddle);
				collision(screen, paddle, ball);
				handleBall(ctx, ball);
				clearBehind(ctx, paddle);
				roundStart = checkPoint(setPlayers, score, ctx, paddle, ball);
			}
			animationFrameId = window.requestAnimationFrame(render);
		}
		animationFrameId = window.requestAnimationFrame(renderReady);
	
		return (() => {
			window.cancelAnimationFrame(animationFrameId);
			document.removeEventListener("keydown", idKey[0]);
			document.removeEventListener("keyup", idKey[1]);
		});
	}, [setPlayers]);

	return (
			<div className="canvas_container">
				{ winner &&
				<>
					<h1 className="get_ready left-[21vw] top-[20vw]">{winner}</h1>
					<ArrowDownward className="get_ready left-[31vw] top-[30vw] text-[8vw]" />
				</>
				}
				<div className={"prompt_wrapper" + (prompt ? "" : " fade")}>
					<h1 className="get_ready left-[23vw] top-[5vw]">GET READY</h1>
					<div className={"key kbd left-[10vw] top-[10vw] " + leftReady}>w</div>
					<div className={"key kbd left-[10vw] top-[25vw] " + leftReady}>s</div>
					<div className={"key kbd right-[10vw] top-[10vw] " + rightReady}>▲</div>
					<div className={"key kbd right-[10vw] top-[25vw] " + rightReady}>▼</div>
				</div>
				<canvas id="pong" ref={canvasRef} className="classique"/>
			</div>
	);
}
