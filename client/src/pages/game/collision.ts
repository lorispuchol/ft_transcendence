
//pad width = 1%
//pad height = 15%

interface Pad {
	w: number,
	h: number,
	rx: number,
	ry: number,
	lx: number,
	ly: number,
}

interface Ball {
	x : number,
	y : number,
	dx : number,
	dy : number,
	rad: number,
	speed : number
}

function wallHit(width: number, height: number, ball: Ball) {
	if (ball.x >= (width - ball.rad) || ball.x <= ball.rad)
		ball.dx *= -1;
	if (ball.y >= (height - ball.rad) || ball.y <= ball.rad)
		ball.dy *= -1;
}

function bounce(ball: Ball, ph: number, px: number, py:number) {

	let angle = -Math.PI * 0.5;
	let collidePoint = (ball.y - py) / ph;
	if (collidePoint > 0.9 || collidePoint < 0.1)
	{
		angle = Math.PI * 0.75;
	}
	else	
		angle += (collidePoint * (Math.PI * -0.2) + Math.PI * 0.1);
	
	let normal = { x: Math.sin(angle), y: -Math.cos(angle)}
	let d = 2 * (ball.dx * normal.x + ball.dy * normal.y);
	
	let t = 1;

	ball.dx -= d * normal.x;
	ball.dy -= d * normal.y;
	//ball.dy *= t;
	console.log(collidePoint, ball.dx, ball.dy)
	return 0;
}

function paddleHit(ctx: CanvasRenderingContext2D, pad: Pad, ball: Ball) {

	function hit(px: number, py: number) {
		const distX = Math.abs(ball.x - px - pad.w * 0.5);
		const distY = Math.abs(ball.y - py - pad.h * 0.5);	

		if (distX > (pad.w * 0.5 + ball.rad)) { return false; }
		if (distY > (pad.h * 0.5 + ball.rad)) { return false; }
	
		if (distX <= (pad.w * 0.5)) { return true; } 
		if (distY <= (pad.h * 0.5)) { return true; }
	
		var dx = distX - pad.w * 0.5;
		var dy = distY - pad.h * 0.5;
		return (dx*dx + dy*dy <= ball.rad ** 2);
	}
	// console.log(ctx.isPointInPath(ball.x, ball.y))
	if (hit(pad.rx, pad.ry))
		bounce(ball, pad.h, pad.rx, pad.ry);	
	else if (hit(pad.lx, pad.ly))
		bounce(ball, pad.h, pad.lx, pad.ly);
}

export default function collision(ctx: CanvasRenderingContext2D, width: number, height: number, pad: Pad, ball: Ball) {
	paddleHit(ctx, pad, ball);
	wallHit(width, height, ball);
}
