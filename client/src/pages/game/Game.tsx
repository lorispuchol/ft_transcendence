
import { useEffect, useRef, useState } from "react";
import "./Game.scss";

// function draw(ctx: CanvasRenderingContext2D, frameCount: number) {
// 	const width: number = ctx.canvas.width;
// 	const height: number = ctx.canvas.height;
// 	ctx.clearRect(0, 0, width, height);
// 	ctx.fillStyle = '#000000';
// 	ctx.beginPath();
// 	ctx.arc(width * 0.5, height * 0.5, 200*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI);
// 	ctx.rect(100, 5, 10, 10)
// 	ctx.fill();
// }

function handleSize(ctx: CanvasRenderingContext2D) {
	function resize() {
		ctx.canvas.width = (window.innerWidth - 40);
		ctx.canvas.height = window.innerHeight * 0.8;
	}
	resize();
	window.addEventListener("resize", resize);
	return resize;
}

enum pad {
	rigth = 0.9,
	left = 0.1
}

function paddle (type: pad ,ctx: CanvasRenderingContext2D, y: number) {
	const width: number = ctx.canvas.width;
	const height: number = ctx.canvas.height;

	ctx.fillStyle = '#FFFFFF';
	ctx.beginPath();
	ctx.rect(width*type, (y - 0.1) * height, width*0.02, height*0.2);
	ctx.fill();
}

function handleMove(setKey: any): any[] {
	let framecount = 0;
	let animationFrameId;

	function onKeyDown({ key }: any) {
		//console.log(key);
		setKey(key);
	}
	function onKeyUp({ key }: any) {
		//console.log("up " + key)
		setKey(null);
	}

	document.addEventListener('keydown', onKeyDown);
	document.addEventListener('keyup', onKeyUp);
	return ([onKeyDown, onkeyup]);
}



export default function Game() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [leftPad, setLeftPad]: [number, Function] = useState(0.5);
	const [rightPad, setRigthPad]: [number, Function] = useState(0.5);
	const [key, setKey]: [any, Function] = useState(null);
	let animationFrameId: number;

	useEffect(() => {
		const ctx = canvasRef!.current!.getContext('2d')!;

		const resize = handleSize(ctx);
		const [idKey] = handleMove((key: string) => {setKey(key)});

		function render() {
			//console.log(key)
			paddle(pad.rigth, ctx, rightPad);
			paddle(pad.left, ctx, leftPad);
			animationFrameId = window.requestAnimationFrame(render);
		}
		animationFrameId = window.requestAnimationFrame(render);
	
		return (() => {
			window.cancelAnimationFrame(animationFrameId);
			window.removeEventListener("resize", resize);
			window.removeEventListener("keydown", idKey[0]);
			window.removeEventListener("keyup", idKey[1]);
		});
	}, [paddle]);

	return (
		<>
			<canvas id="pong" ref={canvasRef} className="classique"/>
			<strong>{key}</strong>
		</>
	);
}
