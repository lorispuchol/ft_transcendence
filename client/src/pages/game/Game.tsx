import LocalGame from "./local/LocalGame";
import './Game.scss';
import { Chip, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import GameMenu from "./GameMenu";
import bird from "./bird.png";

interface player {
	avatar: string,
	username: string,
}

interface Setting {
	type: string,
	mode: string,
}

interface Scores {
	p1: number,
	p2: number,
}

function PlayerCard( {player, score}: any ) {

	if (player)
	{
		const avatar = bird;
		return (
			<Paper className="player_card in_game_card">
				<img src={avatar} alt="avatar" />
				<div className="score">{score}</div>
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
	const [scores, setScores]: [Scores, Function] = useState({p1: 0, p2: 0});
	const [player1, setplayer1]: [player | null, Function] = useState(null);
	const [player2, setplayer2]: [player | null, Function] = useState(null);
	const [setting, setSetting]: [Setting, Function] = useState({type: "menu", mode: "classic"});
	
	function modeSelect() {
		switch(setting.type) {
			case "menu":
				return (<GameMenu setSetting={setSetting}/>);
			case "local":
				return (<LocalGame setScores={setScores} setP1={setplayer1} setP2={setplayer2} />);
		}
	}

	useEffect(() => {
		if (scores.p1 >= 5 || scores.p2 >= 5)
			setSetting({type: "menu", mode: "classic"})
	}, [scores])

	return (
		<>
			<div className="canvas_wrap">
				<PlayerCard player={player1} score={scores.p1} />
				{modeSelect()}
				<PlayerCard player={player2} score={scores.p2} />
			</div>
			{setting.type !== "menu" && 
				<div className="flex justify-center"><button onClick={()=> setSetting({type: "menu", mode: "classic"})}>
					<Paper className="forfeit_button">FORFEIT</Paper>
				</button></div>}
		</>
	)
}
