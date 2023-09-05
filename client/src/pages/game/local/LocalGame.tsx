
import { useEffect, useRef } from "react";
import "../Game.scss";
import handlePaddle, { Pad, handleKey, init_paddle } from "./paddle";
import handleBall, { Ball, drawBall, init_ball } from "./ball";
import collision from "./collision";
import { countDown } from "./countDown";

let freezeFrame = 0;

export interface ScreenSize {
	w: number,
	h: number
}

function checkPoint(setScores: Function, ctx: CanvasRenderingContext2D, screen: ScreenSize, paddle: Pad, ball: Ball) {
	const hitLeft = ball.x <= ball.rad;
	const hitRight = ball.x >= (screen.w - ball.rad);

	if (hitLeft || hitRight) {
		setScores((prev: any) => {
			const newScores = {
				p1: prev.p1 + (hitRight ? 1 : 0),
				p2: prev.p2 + (hitLeft ? 1 : 0)
			}
			return (newScores);
		});
		ball.color = "red"
		drawBall(ctx, ball);
		freezeFrame = 20;
		Object.assign(paddle, init_paddle(screen));
		Object.assign(ball, init_ball(screen));
		return true;
	}
	return false;
}

export default function LocalGame( {setScores, setP1, setP2}: any ) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	
	useEffect(() => {
		const ctx = canvasRef!.current!.getContext('2d')!;
		const screen = {w: 3200, h: 1800}
		ctx.canvas.width = screen.w;
		ctx.canvas.height = screen.h;
		const [idKey] = handleKey();
		const ball : Ball = init_ball(screen);
		const paddle: Pad = init_paddle(screen);
		setScores({p1: 0, p2: 0});
		setP1({avatar: "", username: "player 1"});
		setP2({avatar: "", username: "player 2"});
		
		let animationFrameId: number;
		let roundStart: boolean = true;
		let now = performance.now();

		function render() {
			if (freezeFrame)
			{
				freezeFrame--;
				now = performance.now();
			}
			else if (roundStart)
			{
				roundStart = countDown(ctx, now, 500);
				handlePaddle(ctx, paddle);
				drawBall(ctx, ball);
			}
			else {
				ctx.clearRect(0,0, screen.w, screen.h);
				handlePaddle(ctx, paddle);
				collision(screen, paddle, ball);
				handleBall(ctx, ball);
				roundStart = checkPoint(setScores, ctx, screen, paddle, ball);
			}
			animationFrameId = window.requestAnimationFrame(render);
		}
		animationFrameId = window.requestAnimationFrame(render);
	
		return (() => {
			window.cancelAnimationFrame(animationFrameId);
			document.removeEventListener("keydown", idKey[0]);
			document.removeEventListener("keyup", idKey[1]);
			setP1(null);
			setP2(null);
		});
	}, [setScores, setP1, setP2]);

	return (
			<div className="menu_container">
				<div className="menu_wrapper">
					oui
				</div>
				<canvas id="pong" ref={canvasRef} className="classique"/>
			</div>
	);
}
