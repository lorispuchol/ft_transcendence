import './Game.scss';
import { Chip, Paper } from "@mui/material";
import { useState } from "react";
import GameMenu from "./GameMenu";
import bird from "./bird.png";
import MatchMaking from "./MatchMaking";

interface Player {
	score: number,
	avatar: string,
	username: string,
}

export interface Players {
	p1: Player | null,
	p2: Player | null,
}

export interface Setting {
	type: string,
	mode: string,
}

function PlayerCard( { player }: any ) {

	if (player)
	{
		const avatar = player.avatar === "" ? bird : player.avatar;
		return (
			<Paper className="player_card in_game_card">
				<img src={avatar} alt="avatar" />
				<div className="score">{player.score}</div>
				<Chip label={player.username}/>
				<div/>
			</Paper>
		);
	}
	return (
		<Paper className="player_card"><div className="el_pongo">PONGO</div></Paper>
	)
}

export default function Game() {
	const [players, setPlayers]: [Players, Function] = useState({p1: null, p2: null});
	const [setting, setSetting]: [Setting, Function] = useState({type: "menu", mode: "classic"});
	const [defy, setDefy]: [string | null, Function] = useState(null);

	function modeSelect() {
		switch(setting.type) {
			case "menu":
				return (<GameMenu setSetting={setSetting} setDefy={setDefy}/>);
			case "local":
				return (<MatchMaking setting={setting} setSetting={setSetting} setPlayers={setPlayers} defy={defy}/>);
		}
	}

	return (
		<>
			<div className="canvas_wrap">
				<PlayerCard player={players.p1}/>
				{modeSelect()}
				<PlayerCard player={players.p2}/>
			</div>
			{setting.type !== "menu" &&
				<div className="flex justify-center"><button onClick={()=> {setSetting({type: "menu", mode: "classic"}); setPlayers({p1: null, p2: null})}}>
					<Paper className="forfeit_button font-bold">MENU</Paper>
				</button></div>}
		</>
	)
}
