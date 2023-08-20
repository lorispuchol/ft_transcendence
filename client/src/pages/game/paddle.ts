
interface Pad {
	w: number,
	h: number,
	rx: number,
	ry: number,
	lx: number,
	ly: number,
}

enum spad {
	rigth = 0.9,
	left = 0.08
}

function paddle (type: spad ,ctx: CanvasRenderingContext2D, pad: Pad, y: number) {
	const width: number = ctx.canvas.width;
	const height: number = ctx.canvas.height;

	ctx.fillStyle = '#FFFFFF';
	ctx.beginPath();
	//-10% because of the margin
	ctx.rect(width * type, ((y - 10) * 0.01) * height, width * (pad.w * 0.01), height * (pad.h * 0.01));
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

function movement(pad: Pad) {
	if (rightKey[0] === "ArrowUp" && pad.ry >= 10)
		pad.ry -= 2;
	else if (rightKey[0] === "ArrowDown" && pad.ry <= 95)
		pad.ry += 2;
	
	if (leftKey[0] === "w" && pad.ly >= 10)
		pad.ly -= 2;
	else if (leftKey[0] === "s" && pad.ly <= 95)
		pad.ly += 2;
}

export default function handlePaddle(ctx: CanvasRenderingContext2D, pad: Pad) {
	movement(pad);
	paddle(spad.rigth, ctx, pad, pad.ry);
	paddle(spad.left, ctx, pad, pad.ly);
}
