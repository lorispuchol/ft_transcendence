
interface Ball {
	x : number,
	y : number,
	rad: number,
	dx : number,
	dy : number,
	speed : number
}

export function init_ball(width: number, height: number) {
	const x = width * 0.5;
	const y = height * 0.5;
	const rad = 0.5 * Math.sqrt(width * width + height * height) * 0.015;

	const dx = -20;
	const dy = 0;
	const speed = 2;

	return {x, y, rad, dx, dy, speed};
}

function drawBall(ctx: CanvasRenderingContext2D, ball: Ball) {
	ctx.fillStyle = '#FFFFFF';
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.rad, 0, 2 * Math.PI);
	ctx.fill();
}

export default function handleBall (ctx: CanvasRenderingContext2D, ball: Ball) {
	drawBall(ctx, ball);
	ball.x += ball.dx * ball.speed;
	ball.y += ball.dy * ball.speed;
}
