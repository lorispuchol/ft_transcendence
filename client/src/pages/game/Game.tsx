import './Game.scss';
import { Chip, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import GameMenu from "./GameMenu";
import bird from "./bird.png";
import MatchMaking from "./online/MatchMaking";
import LocalGame from './local/LocalGame';
import { useLocation } from 'react-router-dom';

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
	const location = useLocation();
	const [players, setPlayers]: [Players, Function] = useState({p1: null, p2: null});
	const [defy, setDefy]: [string | null, Function] = useState(location.state ? location.state.to : null);
	const [setting, setSetting]: [Setting, Function] = useState(location.state ? {type: "online", mode: location.state.mode} : {type: "menu", mode: "classic"});

	useEffect(() => {
		setDefy(location.state ? location.state.to : null);
		setSetting(location.state ? {type: "online", mode: location.state.mode} : {type: "menu", mode: "classic"});
	}, [location])

	function returnToMenu() {
		setSetting({type: "menu", mode: setting.mode});
		setPlayers({p1: null, p2: null});
	}

	function modeSelect() {
		switch(setting.type) {
			case "menu":
				return (<GameMenu setSetting={setSetting} setDefy={setDefy}/>);
			case "local":
				return (<LocalGame setPlayers={setPlayers}/>)
			case "online":
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
				<div className="flex justify-center"><button onClick={returnToMenu}>
					<Paper className="forfeit_button font-bold">MENU</Paper>
				</button></div>}
		</>
	)
}
