
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
	r: number,
	speed : number
}

function wallHit(ball: Ball) {
	if (ball.x > (100 - ball.r) || ball.x < ball.r)
		ball.dx *= -1;
	if (ball.y > (100 - ball.r) || ball.y < ball.r)
		ball.dy *= -1;
}

function paddleHit(pad: Pad, ball: Ball) {
	function hit(px: number, py: number) {
		const distX = Math.abs(ball.x - px + pad.w * 0.5);
		const distY = Math.abs(ball.y - py + pad.h * 0.5);	
		
		if (distX > (pad.w * 0.5 + ball.r * 0.5)) { return false; }
		if (distY > (pad.h * 0.5 + ball.r * 0.5)) { return false; }
	
		if (distX <= (pad.w * 0.5)) { return true; } 
		if (distY <= (pad.h * 0.5)) { return true; }
	
		var dx = distX - pad.w * 0.5;
		var dy = distY - pad.h * 0.5;
		return (dx*dx + dy*dy <= ball.r ** 2);
	}

	function bounce(py: number) {
		//console.log("bunce");
		let collidePoint = ball.y - (py + pad.h * 0.5)
		collidePoint = collidePoint / (pad.h * 0.5);

		const angle = (collidePoint * Math.PI) * 0.33;
		ball.dx = ball.speed * Math.sin(angle);
		ball.dy = -ball.speed * Math.cos(angle);
	}

	if (hit(pad.rx, pad.ry))
		bounce(pad.ry);
	if (hit(pad.lx, pad.ly))
		bounce(pad.ly);
	//console.log("no")
}

export default function collision(pad: Pad, ball: Ball) {
	wallHit(ball);
	paddleHit(pad, ball);
}
