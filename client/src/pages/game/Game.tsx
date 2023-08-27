
import { useEffect, useRef } from "react";
import "./Game.scss";
import handlePaddle, { Pad, handleKey, init_paddle } from "./paddle";
import handleBall, { Ball, drawBall, init_ball } from "./ball";
import collision from "./collision";

let freezeFrame = 0;

function checkPoint(ctx: CanvasRenderingContext2D, width: number, height: number, paddle: Pad, ball: Ball) {
	if (ball.x >= (width - 2*ball.rad) || ball.x <= 2*ball.rad) {
		ball.color = "red"
		drawBall(ctx, ball);
		freezeFrame = 20;
		Object.assign(paddle, init_paddle(width,height));
		Object.assign(ball, init_ball(width, height));
	}
}

const times: number[] = [];
function displayFps(ctx: CanvasRenderingContext2D, timestamp: number) {
	const now = timestamp;
	while (times.length > 0 && times[0] <= now - 1000) {
		times.shift();
	}
	times.push(now);
	const fps = times.length;
	ctx.font = "50px Arial"
	ctx.fillText(fps + " fps", 40, 70);
}

export default function Game() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	
	useEffect(() => {
		const ctx = canvasRef!.current!.getContext('2d')!;
		let animationFrameId: number;

		const width = ctx.canvas.width = 3200
		const height = ctx.canvas.height = 1800;
		const [idKey] = handleKey();
		const ball : Ball = init_ball(width, height);
		const paddle: Pad = init_paddle(width, height);


		function render(timestamp: number) {
			if (freezeFrame)
				freezeFrame--;
			else {
				ctx.clearRect(0,0, width, height);
				displayFps(ctx, timestamp);
				handlePaddle(ctx, paddle);
				collision(width, height, paddle, ball);
				handleBall(ctx, ball);
				checkPoint(ctx, width, height, paddle, ball);
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
		<div className="canvas_wrap">
			<canvas id="pong" ref={canvasRef} className="classique"/>
		</div>
	);
}
