

// Change timer face colour
function colourChanger(angle: number)
{
	angle = angle / (2 * Math.PI);
	return 'rgb(' + Math.floor(255 - 183 * angle) + ',' + Math.floor(255 * angle) + ',0)';
}

export function countDown(ctx: CanvasRenderingContext2D, dteStart: number, timer: number)
{
	const width = ctx.canvas.width;
	const height = ctx.canvas.height;

	let d = performance.now();
	let offset = timer - (d - dteStart);
	if(offset <= 0) // If time is up
		return false;
	offset = offset / timer;
	let angle = offset * (2 * Math.PI);

	const x = width * 0.5;
	const y = height * 0.5;
	const rad = 0.02 * Math.sqrt(width * width + height * height);
	
	ctx.beginPath();
	ctx.arc(x, y, rad * 0.8, 0, angle, false);
	ctx.arc(x, y, rad, angle, Math.PI*2, true);
	ctx.fillStyle = colourChanger(angle);
	ctx.fill();
	ctx.closePath();
					
	return true;
}
