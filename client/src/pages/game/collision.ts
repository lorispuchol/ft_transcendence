import { Ball } from "./ball";
import { Pad } from "./paddle";

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

function wallHit(width: number, height: number, ball: Ball) {
	// if (ball.x >= (width - ball.rad) || ball.x <= ball.rad)
	// 	ball.dx *= -1;
	if (ball.y >= (height - ball.rad) || ball.y <= ball.rad)
		ball.dy *= -1;
}

enum padSide {
	Left = 1,
	Right = -1
}

function bounce(side: padSide, ball: Ball, ph: number, px: number, py:number) {
	
	console.log("collide");
	let angle = -Math.PI * 0.5;
	let collidePoint = (ball.y - py) / ph + 0.01;
	collidePoint = clamp(collidePoint, 0, 1);
	angle += (collidePoint * (Math.PI * -0.2) + Math.PI * 0.1);
	
	let normal = { x: Math.sin(angle), y: -Math.cos(angle)}
	let d = 2 * (ball.dx * normal.x + ball.dy * normal.y);


	ball.dx -= d * normal.x * ball.acc;
	ball.dy -= d * normal.y * ball.acc;
	
	ball.dx = Math.abs(ball.dx) * side

	return 0;
}

function paddleHit(pad: Pad, ball: Ball) {

	function hit(px: number, py: number) {
		const distX = Math.abs(ball.x - px - pad.w * 0.5);
		const distY = Math.abs(ball.y - py - pad.h * 0.5);	

		if (distX > (pad.w * 0.5 + ball.rad)) { return false; }
		if (distY > (pad.h * 0.5 + ball.rad)) { return false; }
	
		if (distX <= (pad.w * 0.5)) { return true; } 
		if (distY <= (pad.h * 0.5)) { return true; }
	
		const dx = distX - pad.w * 0.5;
		const dy = distY - pad.h * 0.5;
		return (dx*dx + dy*dy <= ball.rad ** 2);
	}
	if (hit(pad.rx, pad.ry))
		bounce(padSide.Right, ball, pad.h, pad.rx, pad.ry);	
	else if (hit(pad.lx, pad.ly))
		bounce(padSide.Left, ball, pad.h, pad.lx, pad.ly);
}

export default function collision(width: number, height: number, pad: Pad, ball: Ball) {
	paddleHit(pad, ball);
	wallHit(width, height, ball);
}
