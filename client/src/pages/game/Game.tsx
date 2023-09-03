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

interface Setting {
	type: string,
	mode: string,
}

function PlayerCard( {player}: any ) {
	return (
		<Paper className="player_card"><div className="el_pongo">PONGO</div></Paper>
	)
}

function modeSelect(type: string, setSetting: Function) {
	switch(type) {
		case "menu":
			return (<GameMenu setSetting={setSetting}/>);
		case "local":
				return (<LocalGame />);
	}
}

export default function Game() {
	const [player1, setplayer1]: [player | null, Function] = useState(null);
	const [player2, setplayer2]: [player | null, Function] = useState(null);
	const [setting, setSetting]: [Setting, Function] = useState({type: "menu", mode: "classic"});
	
	return (
		<>
			<div className="canvas_wrap">
				<PlayerCard player={player1} />
				{modeSelect(setting.type, setSetting)}
				<PlayerCard player={player2} />
			</div>
			{setting.type !== "menu" && 
				<div className="flex justify-center"><button onClick={()=> setSetting({type: "menu", mode: "classic"})}>
					<Paper className="forfeit_button">FORFEIT</Paper>
				</button></div>}
		</>
	)
}
