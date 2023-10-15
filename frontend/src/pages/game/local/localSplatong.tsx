
import { useEffect, useRef, useState } from "react";
import "../Game.scss";
import { Pad, handleKey, init_paddle, splatHandlePaddle, splatHandlePaddleGetReady } from "./paddle";
import handleBall, { Ball, drawBall, init_ball } from "./ball";
import collision, { clamp } from "./collision";
import { countDown } from "./countDown";
import { ArrowDownward } from "@mui/icons-material";


export interface ScreenSize {
	w: number,
	h: number
}

function drawBackground(ctx: CanvasRenderingContext2D, screen: ScreenSize, background: number[][]) {
	let x: number = 0;
	let y: number = 0;
	let color: number = 0;
	while (x < 25)
	{
		y = 0;
		while (y < 25)
		{
			color = background[y][x]
			if (color === 1)
				ctx.fillStyle = "orange";
			else if (color === 2)
				ctx.fillStyle = "blue";
			else
				ctx.fillStyle = "white";	
			ctx.fillRect(x * 128, y * 72, 1280, 720);
			y++;
		}
		x++;
	}
}

function colorTomatrix(color: string) {
	switch (color)
	{
		case "orange":
			return 1;
		case "blue":
			return 2;
		default:
			return 0;
	}
}

export default function LocalSplatong( { setPlayers, setScore }: any ) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [prompt, setPrompt]: [boolean, Function] = useState(true);
	const [winner, setWinner]: [string, Function] = useState("");
	const [leftReady, setLeftReady]: [string, Function] = useState("blinking");
	const [rightReady, setRightReady]: [string, Function] = useState("blinking");
	
	
	useEffect(() => {
		setPlayers({p1: {id: 0, username: "Player 1"}, p2: {id: 0, username: "Player 2"}});
		
		const gameDuration: number = 60;
		setScore({p1: gameDuration, p2: gameDuration});
		
		const ctx = canvasRef!.current!.getContext('2d')!;
		const screen = {w: 3200, h: 1800}
		ctx.canvas.width = screen.w;
		ctx.canvas.height = screen.h;
		
		const [idKey] = handleKey();
		const ball : Ball = init_ball(screen);
		ball.speedCap = 45;
		ball.color = "black";
		const paddle: Pad = init_paddle(screen);
	
		const background: number[][] = Array.from({length: 25}, () => Array.from({length: 25}, () => 0));
		let animationFrameId: number;
		let endTime: number;
		let now: number;
		

		let ready: boolean[] = [false, false];
		function renderReady() {
			drawBackground(ctx, screen, background);
			splatHandlePaddleGetReady(ctx, paddle, ready, setLeftReady, setRightReady);
			drawBall(ctx, ball);
			if (ready[0] && ready[1])
			{
				setPrompt(false);
				now = performance.now();
				endTime = now + gameDuration * 1000;
				animationFrameId = window.requestAnimationFrame(renderRoundStart);
				return ;
			}
			animationFrameId = window.requestAnimationFrame(renderReady);
		}
		
		function renderRoundStart() {
			drawBackground(ctx, screen, background);
			splatHandlePaddle(ctx, paddle);
			drawBall(ctx, ball);
			if (countDown(ctx, now, 500))
				animationFrameId = window.requestAnimationFrame(renderRoundStart);
			else
				animationFrameId = window.requestAnimationFrame(render);
		}

		function renderEnd() {
			setWinner("player 1 win");
			setWinner("player 2 win");
		}

		function xMatrix() {return (clamp(Math.round(ball.x / 128), 0, 24))}
		function yMatrix() {return (clamp(Math.round(ball.y / 72), 0, 24))}

		function render() {
			drawBackground(ctx, screen, background);
			splatHandlePaddle(ctx, paddle);
			ball.color = collision(screen, paddle, ball);
			handleBall(ctx, ball);
			background[yMatrix()][xMatrix()] = colorTomatrix(ball.color);
			now = Math.round((endTime - performance.now()) * 0.001);
			setScore({p1: now, p2: now})
			if (now <= 0)
			{
				animationFrameId = window.requestAnimationFrame(renderEnd);
				return ;
			}
			animationFrameId = window.requestAnimationFrame(render);
		}
		animationFrameId = window.requestAnimationFrame(renderReady);
	
		return (() => {
			window.cancelAnimationFrame(animationFrameId);
			document.removeEventListener("keydown", idKey[0]);
			document.removeEventListener("keyup", idKey[1]);
		});
	}, [setPlayers, setScore]);

	return (
			<div className="canvas_container">
				{ winner &&
					<h1 className="get_ready left-[21vw] top-[20vw]">{winner}</h1>
				}
				<div className={"prompt_wrapper" + (prompt ? "" : " fade")}>
					<h1 className="get_ready left-[23vw] top-[5vw]">GET READY</h1>
					<div className={"splatkey kbd left-[10vw] top-[10vw] " + leftReady}>w</div>
					<div className={"splatkey kbd left-[10vw] top-[25vw] " + leftReady}>s</div>
					<div className={"splatkey kbd right-[10vw] top-[10vw] " + rightReady}>▲</div>
					<div className={"splatkey kbd right-[10vw] top-[25vw] " + rightReady}>▼</div>
				</div>
				<canvas id="pong" ref={canvasRef} className="classique"/>
			</div>
	);
}