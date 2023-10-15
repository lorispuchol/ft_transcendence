import { ScreenSize } from "./OnlineGame";
import { Ball } from "../local/ball";
import { Pad } from "./paddle";

export const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

function wallHit(height: number, width: number, ball: Ball) {
	if (ball.y >= (height - ball.rad) || ball.y <= ball.rad)
		ball.dy *= -1;
	if (ball.x >= (width - ball.rad) || ball.x <= ball.rad)
		ball.dx *= -1;
}

function bounce(side: number, ball: Ball, ph: number, py:number) {
	let angle = -Math.PI * 0.5;
	let collidePoint = (ball.y - py) / ph;
	collidePoint = clamp(collidePoint, 0, 1);
	angle += (collidePoint * (Math.PI * -0.2) + Math.PI * 0.1);

	if (ball.speed < 70)
		ball.speed += ball.acc;
	ball.dx =  Math.abs(Math.sin(angle)) * side;
	ball.dy = -Math.cos(angle);
}

function paddleHit(side: number, pad: Pad, ball: Ball) {

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
	if (hit(pad.ownX, pad.ownY))
	{
		bounce(side, ball, pad.h, pad.ownY);
		return (pad.ownColor);
	}	
	else if (hit(pad.opX, pad.opY))
	{
		bounce(-side, ball, pad.h, pad.opY);
		return (pad.opColor);
	}
	return ball.color;
}

export default function collision(screen: ScreenSize, side: number, pad: Pad, ball: Ball) {
	const color = paddleHit(side, pad, ball);
	wallHit(screen.h, screen.w, ball);
	return color;
}
