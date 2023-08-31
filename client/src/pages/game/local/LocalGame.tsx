
import { useEffect, useRef } from "react";
import "../Game.scss";
import handlePaddle, { Pad, handleKey, init_paddle } from "./paddle";
import handleBall, { Ball, drawBall, init_ball } from "./ball";
import collision from "./collision";
import { countDown } from "./countDown";

let freezeFrame = 0;

function checkPoint(ctx: CanvasRenderingContext2D, width: number, height: number, paddle: Pad, ball: Ball) {
	if (ball.x >= (width - 2*ball.rad) || ball.x <= 2*ball.rad) {
		ball.color = "red"
		drawBall(ctx, ball);
		freezeFrame = 20;
		Object.assign(paddle, init_paddle(width,height));
		Object.assign(ball, init_ball(width, height));
		return true;
	}
	return false;
}

export default function LocalGame() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	
	useEffect(() => {
		const ctx = canvasRef!.current!.getContext('2d')!;
		
		const width = ctx.canvas.width = 3200;
		const height = ctx.canvas.height = 1800;
		const [idKey] = handleKey();
		const ball : Ball = init_ball(width, height);
		const paddle: Pad = init_paddle(width, height);
		
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
				ctx.clearRect(0,0, width, height);
				handlePaddle(ctx, paddle);
				collision(width, height, paddle, ball);
				handleBall(ctx, ball);
				roundStart = checkPoint(ctx, width, height, paddle, ball);
			}
			animationFrameId = window.requestAnimationFrame(render);
		}
		animationFrameId = window.requestAnimationFrame(render);
	
		return (() => {
			window.cancelAnimationFrame(animationFrameId);
			document.removeEventListener("keydown", idKey[0]);
			document.removeEventListener("keyup", idKey[1]);
		});
	}, []);

	return (
			<canvas id="pong" ref={canvasRef} className="classique"/>
	);
}
