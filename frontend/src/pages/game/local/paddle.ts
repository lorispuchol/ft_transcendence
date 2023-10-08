import { teritaryColor } from "../../../style/color";
import { ScreenSize } from "./LocalGame";

export interface Pad {
	w: number,
	h: number,
	rx: number,
	ry: number,
	lx: number,
	ly: number,
}

export function init_paddle(screen: ScreenSize) {
	const w = screen.w * 0.01;
	const h = screen.h * 0.15;

	const rx = screen.w * 0.9 - w * 0.5;
	const ry = screen.h * 0.5 - h * 0.5;

	const lx = screen.w * 0.1 - w * 0.5;
	const ly = screen.h * 0.5 - h * 0.5;

	return {w, h, rx, ry, lx, ly};
}


export function drawPaddle (ctx: CanvasRenderingContext2D, pad: Pad) {
	ctx.fillStyle = teritaryColor;
	ctx.beginPath();
	ctx.rect(pad.lx, pad.ly, pad.w , pad.h);
	ctx.rect(pad.rx, pad.ry, pad.w , pad.h);
	ctx.fill();
}


const allowedLeftKey = ['w', 's'];
let leftKey: string[] = [];
const allowedRightKey = ['ArrowUp', 'ArrowDown'];
let rightKey: string[] = [];

export function handleKey(): any[] {

	function onKeyDown(e: any) {
		if (e.repeat)
			return ;
		if (allowedRightKey.includes(e.key) && !rightKey.includes(e.key))
			rightKey.push(e.key);
		else if (allowedLeftKey.includes(e.key) && !leftKey.includes(e.key))
			leftKey.push(e.key);
	}
	function onKeyUp(e: any) {
		if (e.repeat)
			return;
		if (allowedRightKey.includes(e.key))
			rightKey = rightKey.filter((k) => k !== e.key);
		else if (allowedLeftKey.includes(e.key))
			leftKey = leftKey.filter((k) => (k !== e.key));
	}

	document.addEventListener('keydown', onKeyDown);
	document.addEventListener('keyup', onKeyUp);
	return ([onKeyDown, onkeyup]);
}

function movement(height: number, pad: Pad) {
	const borderGap: number = height * 0.006;
	const speed: number = height * 0.02;

	if (rightKey[0] === "ArrowUp" && pad.ry >= borderGap)
		pad.ry -= speed;
	else if (rightKey[0] === "ArrowDown" && pad.ry <= height - pad.h - borderGap)
		pad.ry += speed;
	
	if (leftKey[0] === "w" && pad.ly >= borderGap)
		pad.ly -= speed;
	else if (leftKey[0] === "s" && pad.ly <= height - pad.h - borderGap)
		pad.ly += speed;
}

export function handlePaddleGetReady(ctx: CanvasRenderingContext2D, pad: Pad, ready: boolean[], setLeftReady: Function, setRightReady: Function) {
	const height = ctx.canvas.height;
	const borderGap: number = height * 0.006;
	const speed: number = height * 0.02;

	if (rightKey.length !== 0)
	{
		setRightReady("border-green-500");
		ready[1] = true;
	}
	if (leftKey.length !== 0)
	{
		setLeftReady("border-green-500");
		ready[0] = true;
	}


	if (rightKey[0] === "ArrowUp" && pad.ry >= borderGap)
		pad.ry -= speed;
	else if (rightKey[0] === "ArrowDown" && pad.ry <= height - pad.h - borderGap)
		pad.ry += speed;
	
	if (leftKey[0] === "w" && pad.ly >= borderGap)
		pad.ly -= speed;
	else if (leftKey[0] === "s" && pad.ly <= height - pad.h - borderGap)
		pad.ly += speed;

	drawPaddle(ctx, pad);
}

export default function handlePaddle(ctx: CanvasRenderingContext2D, pad: Pad) {
	movement(ctx.canvas.height, pad);
	drawPaddle(ctx, pad);
}
