import { Ball } from "./ball";
import { Pad } from "./paddle";

export const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

function wallHit(width: number, height: number, ball: Ball) {
	if (ball.y >= (height - ball.rad) || ball.y <= ball.rad)
		ball.dy *= -1;
}

enum padSide {
	Left = 1,
	Right = -1
}

function bounce(side: padSide, ball: Ball, ph: number, px: number, py:number) {
	let angle = -Math.PI * 0.5;
	let collidePoint = (ball.y - py) / ph;
	collidePoint = clamp(collidePoint, 0, 1);
	angle += (collidePoint * (Math.PI * -0.2) + Math.PI * 0.1);

	if (ball.speed < 100)
		ball.speed += ball.acc;
	ball.dx =  Math.abs(Math.sin(angle)) * side;
	ball.dy = -Math.cos(angle);
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
