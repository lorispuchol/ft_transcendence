
interface Pad {
	w: number,
	h: number,
	rx: number,
	ry: number,
	lx: number,
	ly: number,
}

export function init_paddle(width: number, height: number) {
	const w = width * 0.01;
	const h = height * 0.15;

	const rx = width * 0.9 - w * 0.5;
	const ry = height * 0.5 - h * 0.5;

	const lx = width * 0.1 - w * 0.5;
	const ly = height * 0.5 - h * 0.5;

	return {w, h, rx, ry, lx, ly};
}


function paddle (ctx: CanvasRenderingContext2D, pad: Pad) {
	ctx.fillStyle = '#FFFFFF';
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

export default function handlePaddle(ctx: CanvasRenderingContext2D, pad: Pad) {
	movement(ctx.canvas.height, pad);
	paddle(ctx, pad);
}
