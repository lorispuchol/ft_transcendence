import { useEffect, useRef } from "react";
import handleBall, { Ball, init_ball } from "./local/ball";
import './Game.scss';
import { ScreenSize } from "./local/LocalGame";

function wallHit(screen: ScreenSize, ball: Ball) {
	if (ball.y >= (screen.h - ball.rad) || ball.y <= ball.rad)
		ball.dy *= -1;
	
	if (ball.x >= (screen.w - ball.rad) || ball.x <= ball.rad)
		ball.dx *= -1;
}

export default function DemoGame() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const ctx = canvasRef!.current!.getContext('2d')!;
		let animationFrameId: number;
		
		const screen = {w: 3200, h: 1800}
		ctx.canvas.width = screen.w;
		ctx.canvas.height = screen.h;
		const ball : Ball = init_ball(screen);

		function render() {
			ctx.clearRect(0,0, screen.w, screen.h);
			wallHit(screen, ball);
			handleBall(ctx, ball);
			animationFrameId = window.requestAnimationFrame(render);
		}
		animationFrameId = window.requestAnimationFrame(render);
	
		return (() => {window.cancelAnimationFrame(animationFrameId);});
	}, []);

	return (
		<canvas id="pong" ref={canvasRef} className="classique demo"/>
	);
}
