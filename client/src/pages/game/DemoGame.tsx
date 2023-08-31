import { useEffect, useRef } from "react";
import handleBall, { Ball, drawBall } from "./local/ball";
import { Pad, drawPaddle, init_paddle } from "./local/paddle";
import { countDown } from "./local/countDown";
import collision, { clamp } from "./local/collision";
import { teritaryColor } from "../../style/color";
import './Game.scss';

let freezeFrame = 0;

function checkPoint(ctx: CanvasRenderingContext2D, width: number, height: number, paddle: Pad, ball: Ball) {
	if (ball.x >= (width - 2*ball.rad) || ball.x <= 2*ball.rad) {
		ball.color = "red"
		drawBall(ctx, ball);
		freezeFrame = 20;
		Object.assign(paddle, init_paddle(width,height));
		Object.assign(ball, initDemoball(width, height));
		return true;
	}
	return false;
}

function initDemoball(width: number, height: number) {
	const color = teritaryColor;
	const x = width * 0.5;
	const y = height * 0.5;
	const rad = 0.5 * Math.sqrt(width * width + height * height) * 0.015;

	const dx = 20;
	const dy = 5;
	const speed = 2.5;
	const acc = 1;

	return {color, x, y, rad, dx, dy, speed, acc};
}

export default function DemoGame() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const ctx = canvasRef!.current!.getContext('2d')!;
		
		const width = ctx.canvas.width = 3200;
		const height = ctx.canvas.height = 1800;
		const ball : Ball = initDemoball(width, height);
		const paddle: Pad = init_paddle(width, height);
		const borderUpGap: number = height * 0.006;
		const borderDownGap = height - paddle.h - borderUpGap;
		
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
				drawPaddle(ctx, paddle);
				drawBall(ctx, ball);
			}
			else {
				ctx.clearRect(0,0, width, height);
				paddle.ry = paddle.ly = clamp(ball.y - paddle.h * 0.5, borderUpGap, borderDownGap);
				drawPaddle(ctx, paddle);
				collision(width, height, paddle, ball);
				handleBall(ctx, ball);
				roundStart = checkPoint(ctx, width, height, paddle, ball);
			}
			animationFrameId = window.requestAnimationFrame(render);
		}
		animationFrameId = window.requestAnimationFrame(render);
	
		return (() => {window.cancelAnimationFrame(animationFrameId);});
	}, []);

	return (
		<canvas id="pong" ref={canvasRef} className="classique demo"/>
	);
}
