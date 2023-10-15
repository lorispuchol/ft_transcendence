
import { useEffect, useRef, useState } from "react";
import "../Game.scss";
import { Pad, handleKey, init_paddle, splatHandlePaddle, splatHandlePaddleGetReady } from "./paddle";
import handleBall, { Ball, drawBall, init_ball } from "./ball";
import collision, { clamp } from "./collision";
import { countDown } from "./countDown";

export interface ScreenSize {
	w: number,
	h: number
}

export const p1Color = "orange";
export const p2Color = "blue";

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

export default function LocalSplatong( { setPlayers, setScore }: any ) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [prompt, setPrompt]: [boolean, Function] = useState(true);
	const [winner, setWinner]: [string, Function] = useState("");
	const [leftReady, setLeftReady]: [string, Function] = useState("blinking");
	const [rightReady, setRightReady]: [string, Function] = useState("blinking");
	
	
	useEffect(() => {
		setPlayers({p1: {id: 0, username: p1Color}, p2: {id: 0, username: p2Color}});
		
		const gameDuration: number = 5;
		setScore({p1: gameDuration, p2: gameDuration});
		
		const ctx = canvasRef!.current!.getContext('2d')!;
		const screen = {w: 3200, h: 1800}
		ctx.canvas.width = screen.w;
		ctx.canvas.height = screen.h;

		const [idKey] = handleKey();
		const ball : Ball = init_ball(screen);
		ball.speedCap = 45;
		const paddle: Pad = init_paddle(screen);
	
		const cell: number = 25;
		const cellSize: {w: number, h: number} = {w: screen.w / cell, h: screen.h / cell};
		const background: number[][] = Array.from({length: cell}, () => Array.from({length: cell}, () => 0));
		
		let animationFrameId: number;
		let endTime: number;
		let now: number;
		
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

		let ready: boolean[] = [false, false];
		function renderReady() {
			drawBackground();
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
			drawBackground();
			splatHandlePaddle(ctx, paddle);
			drawBall(ctx, ball);
			if (countDown(ctx, now, 500))
				animationFrameId = window.requestAnimationFrame(renderRoundStart);
			else
				animationFrameId = window.requestAnimationFrame(render);
		}

		function renderEnd() {
			let p1Score: number = 0;
			let p2Score: number = 0;
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
						p1Score++;
					else if (color === 2)
						p2Score++;	
					y++;
				}
				x++;
			}
			if (p1Score > p2Score)
				setWinner(p1Color + " win");
			else if (p2Score > p1Score)
				setWinner(p2Color + " win");
			else
				setWinner("wtf les amis")
		}

		const widthRatio = 1 / cellSize.w;
		const heighRatio = 1 / cellSize.h;
		function xMatrix() {return (clamp(Math.floor(ball.x * widthRatio), 0, cell - 1))}
		function yMatrix() {return (clamp(Math.floor(ball.y * heighRatio), 0, cell - 1))}

		function render() {
			drawBackground();
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