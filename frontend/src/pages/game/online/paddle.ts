import { Socket } from "socket.io-client";
import { teritaryColor } from "../../../style/color";
import { ScreenSize } from "./OnlineGame";

export interface Pad {
	w: number,
	h: number,
	ownX: number,
	ownY: number,
	opX: number,
	opY: number,
}

export function init_paddle(screen: ScreenSize, side: number) {
	const w = screen.w * 0.01;
	const h = screen.h * 0.15;

	const ownY = screen.h * 0.5 - h * 0.5;
	const opY = screen.h * 0.5 - h * 0.5;

	let ownX: number;
	let opX: number;

	if (side === 1)
	{
		ownX = screen.w * 0.1 - w * 0.5;
		opX = screen.w * 0.9 - w * 0.5;
	}
	else
	{
		ownX = screen.w * 0.9 - w * 0.5;
		opX = screen.w * 0.1 - w * 0.5;
	}

	return {w, h, ownX, ownY, opX, opY};
}


export function drawPaddle (ctx: CanvasRenderingContext2D, pad: Pad) {
	ctx.fillStyle = teritaryColor;
	ctx.beginPath();
	ctx.rect(pad.ownX, pad.ownY, pad.w , pad.h);
	ctx.rect(pad.opX, pad.opY, pad.w , pad.h);
	ctx.fill();
}

export function clearBehind(ctx: CanvasRenderingContext2D, pad: Pad, side: number) {
	if (side === 1)
	{
		ctx.clearRect(pad.ownX - pad.w , pad.ownY, pad.w, pad.h);
		ctx.clearRect(pad.opX + 2 * pad.w , pad.opY, pad.w, pad.h);
	}
	else
	{
		ctx.clearRect(pad.ownX + 2 * pad.w , pad.ownY, pad.w, pad.h);
		ctx.clearRect(pad.opX - pad.w , pad.opY, pad.w, pad.h);
	}
}

const allowedKey = ['ArrowUp', 'ArrowDown'];
let key: string = "idle";

export function handleKey(): any[] {

	function onKeyDown(e: any) {
		if (e.repeat)
			return ;
		if (allowedKey.includes(e.key) && key !== e.key)
			key = e.key;
	}
	function onKeyUp(e: any) {
		if (e.repeat)
			return;
		if (allowedKey.includes(e.key) && key === e.key)
			key = "idle";
	}

	document.addEventListener('keydown', onKeyDown);
	document.addEventListener('keyup', onKeyUp);
	return ([onKeyDown, onkeyup]);
}

function movement(height: number, pad: Pad, openentKey: string) {
	const borderGap: number = height * 0.006;
	const speed: number = height * 0.02;

	if (key === "ArrowUp" && pad.ownY >= borderGap)
		pad.ownY -= speed;
	else if (key === "ArrowDown" && pad.ownY <= height - pad.h - borderGap)
		pad.ownY += speed;
	
	if (openentKey === "ArrowUp" && pad.opY >= borderGap)
		pad.opY -= speed;
	else if (openentKey === "ArrowDown" && pad.opY <= height - pad.h - borderGap)
		pad.opY += speed;
}

export default function handlePaddle(ctx: CanvasRenderingContext2D, pad: Pad, openentKey: string, socket: Socket) {
	movement(ctx.canvas.height, pad, openentKey);
	socket.emit("input", key);
	drawPaddle(ctx, pad);
}