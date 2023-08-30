
export interface Ball {
	color: string,
	x : number,
	y : number,
	rad: number,
	dx : number,
	dy : number,
	speed : number,
	acc: number,
}

function rng(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) ) + min;
}

export function init_ball(width: number, height: number) {
	const color = "white";
	const x = width * 0.5;
	const y = height * 0.5;
	const rad = 0.5 * Math.sqrt(width * width + height * height) * 0.015;

	const dx = rng(0, 1) ? 20 : -20;
	const dyRng = rng(-10, 10);
	const dy = dyRng ? dyRng : 1;
	const speed = 1.5;
	const acc = 1.03;

	return {color, x, y, rad, dx, dy, speed, acc};
}

export function drawBall(ctx: CanvasRenderingContext2D, ball: Ball) {
	ctx.fillStyle = ball.color;
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.rad, 0, 2 * Math.PI);
	ctx.fill();
}

export default function handleBall (ctx: CanvasRenderingContext2D, ball: Ball) {
	ball.x += ball.dx * ball.speed;
	ball.y += ball.dy * ball.speed;
	drawBall(ctx, ball);
}
