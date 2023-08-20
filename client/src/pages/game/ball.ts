
interface Ball {
	x : number,
	y : number,
	dx : number,
	dy : number,
	r: number,
	speed : number
}

function drawBall(ctx: CanvasRenderingContext2D, ball: Ball) {
	const width: number = ctx.canvas.width;
	const height: number = ctx.canvas.height;

	console.log(width, height);
	ctx.fillStyle = '#FFFFFF';
	ctx.beginPath();
	ctx.arc(width * (ball.x * 0.01), height * (ball.y * 0.01),
		((width + height) * 0.62) * (ball.r * 0.01), 0, 2 * Math.PI);
	ctx.fill();
}

export default function handleBall (ctx: CanvasRenderingContext2D, ball: Ball) {
	drawBall(ctx, ball);
	ball.x += ball.dx;
	ball.y += ball.dy;
}
