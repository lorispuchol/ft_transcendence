import LocalGame from "./local/LocalGame";
import './Game.scss';
import { Paper } from "@mui/material";
import { useState } from "react";
import GameMenu from "./GameMenu";

interface player {
	score: number,
	avatar: any,
	username: string,
}

function PlayerCard( {player}: any ) {
	return (
		<Paper className="player_card"><div className="el_pongo">PONGO</div></Paper>
	)
}

function modeSelect(mode: string, setMode: Function) {
	switch(mode) {
		case "menu":
			return (<GameMenu setMode={setMode}/>);
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
				<PlayerCard player={player1} />
				{modeSelect(mode, setMode)}
				<PlayerCard player={player2} />
			</div>
			{mode !== "menu" && <div className="flex justify-center"><Paper className="forfeit_button">FORFEIT</Paper></div>}
		</>
	)
}
