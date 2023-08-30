import { useRef } from "react";

export default function GameMenu() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	return (
		<canvas id="pong" ref={canvasRef} className="classique"/>
	);
}
