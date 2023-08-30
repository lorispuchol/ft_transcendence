import LocalGame from "./LocalGame";
import './Game.scss';
import { Paper } from "@mui/material";
import { useState } from "react";
import GameMenu from "./GameMenu";

interface player {
	score: number,
	avatar: any,
	username: string,
}

function modeSelect(mode: string) {
	switch(mode) {
		case "menu":
			return (<GameMenu />);
		case "local":
			return (<LocalGame />);
	}
}

export default function Game() {
	const [player1, setplayer1]: [player | null, Function] = useState(null);
	const [player2, setplayer2]: [player | null, Function] = useState(null);
	const [mode, setMode]: [string, Function] = useState("menu");
	
	return (
		<>
			<div className="canvas_wrap">
				<Paper className="player_card"><div className="el_pongo">PONGO</div></Paper>
				{modeSelect(mode)}
				<Paper className="player_card"><div className="el_pongo">PONGO</div></Paper>
			</div>
			{mode !== "menu" && <div className="flex justify-center"><Paper className="forfeit_button">FORFEIT</Paper></div>}
		</>
	)
}
