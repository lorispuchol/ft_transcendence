import { useEffect, useRef } from "react";
import handleBall, { Ball, init_ball } from "./local/ball";
import { teritaryColor } from "../../style/color";
import './Game.scss';

function wallHit(width: number, height: number, ball: Ball) {
	if (ball.y >= (height - ball.rad) || ball.y <= ball.rad)
		ball.dy *= -1;
	
	if (ball.x >= (width - ball.rad) || ball.x <= ball.rad)
		ball.dx *= -1;
}

export default function DemoGame() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const ctx = canvasRef!.current!.getContext('2d')!;
		let animationFrameId: number;
		
		const width = ctx.canvas.width = 3200;
		const height = ctx.canvas.height = 1800;
		const ball : Ball = init_ball(width, height);

		function render() {
			ctx.clearRect(0,0, width, height);
			wallHit(width, height, ball);
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
