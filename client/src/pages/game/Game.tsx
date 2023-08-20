
import { useEffect, useRef } from "react";
import "./Game.scss";
import handlePaddle, { handleKey } from "./paddle";
import handleBall from "./ball";
import collision from "./collision";

function handleSize(ctx: CanvasRenderingContext2D) {
	function resize() {
		ctx.canvas.width = (window.innerWidth - 40);
		ctx.canvas.height = window.innerHeight * 0.8;
	}
	resize();
	window.addEventListener("resize", resize);
	return resize;
}

const defaultBall = {
	x : 50,
	y : 50,
	dx : -0.5,
	dy : 0,
	r: 2,
	speed : 0.01
}

const defaultPaddle = {
	w: 1,
	h: 15,
	//rightPaddle pos
	rx: 90,
	ry: 50,
	//leftPaddle pos
	lx: 8,
	ly: 50,
}

export default function Game() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	
	useEffect(() => {
		const ctx = canvasRef!.current!.getContext('2d')!;
		let animationFrameId: number;

		const resize = handleSize(ctx);
		const [idKey] = handleKey();
		let ball = defaultBall;
		let paddle = defaultPaddle;

		function render() {
			ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
			handlePaddle(ctx, paddle);
			handleBall(ctx, ball);
			collision(paddle, ball);
			animationFrameId = window.requestAnimationFrame(render);
		}
		render();
	
		return (() => {
			window.cancelAnimationFrame(animationFrameId);
			window.removeEventListener("resize", resize);
			document.removeEventListener("keydown", idKey[0]);
			document.removeEventListener("keyup", idKey[1]);
		});
	}, []);

	return (
			<canvas id="pong" ref={canvasRef} className="classique"/>
	);
}
