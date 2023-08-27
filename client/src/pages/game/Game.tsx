
import { useEffect, useRef } from "react";
import "./Game.scss";
import handlePaddle, { handleKey, init_paddle } from "./paddle";
import handleBall, { init_ball } from "./ball";
import collision from "./collision";

interface Ball {
	x : number,
	y : number,
	rad: number,
	dx : number,
	dy : number,
	speed : number
}

interface Pad {
	w: number,
	h: number,
	rx: number,
	ry: number,
	lx: number,
	ly: number,
}

function checkPoint(width: number, height: number, paddle: Pad, ball: Ball) {
	if (ball.x >= (width - ball.rad) || ball.x <= ball.rad) {
		Object.assign(paddle, init_paddle(width,height));
		Object.assign(ball, init_ball(width, height));
	}
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

		function render() {
			ctx.clearRect(0,0, width, height);
			//checkPoint(width, height, paddle, ball);
			handlePaddle(ctx, paddle);
			collision(ctx, width, height, paddle, ball);
			handleBall(ctx, ball);
			animationFrameId = window.requestAnimationFrame(render);
		}
		render();
	
		return (() => {
			window.cancelAnimationFrame(animationFrameId);
			document.removeEventListener("keydown", idKey[0]);
			document.removeEventListener("keyup", idKey[1]);
		});
	}, []);

	return (
		<div className="wrap">
			<canvas id="pong" ref={canvasRef} className="classique"/>
		</div>
	);
}
