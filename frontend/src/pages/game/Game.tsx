import './Game.scss';
import { Chip, Paper } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import GameMenu from "./GameMenu";
import bird from "./bird.png";
import MatchMaking from "./online/MatchMaking";
import LocalGame from './local/LocalGame';
import { GetRequest } from '../../utils/Request';
import { EventContext } from '../../utils/Context';

interface UserData {
	id: number,
	avatar: string,
	login: string,
	username: string,
	nb_victory: number,
	nb_defeat: number,
}

interface Response {
	status: string,
	data?: UserData,
	error?: string,
}

interface Player {
	score: number,
	id: number,
	username: string | null,
}

export interface Players {
	p1: Player | null,
	p2: Player | null,
	side?: number,
}

export interface Setting {
	type: string,
	mode: string,
}

function PlayerCard( { player }: any ) {
	const [user, setUser]: [any, Function] = useState({
		avatar: bird,
		id: player.id,
		username: player.username
	});

	useEffect(() => {
		if (!user.id)
			return ;
		GetRequest("/user/profile/id/" + user.id).then((response: Response) => {
			if (response.status === "OK")
				setUser({
					avatar : response.data!.avatar ? response.data!.avatar : bird,
					id: user.id,
					username: response.data!.username
				})
		});

	}, [user]);

	return (
		<Paper className="player_card in_game_card">
			<img src={user.avatar} alt="avatar" />
			<div className="score">{player.score}</div>
			<Chip label={user.username}/>
			<div/>
		</Paper>
	);
}

export default function Game() {
	const socket = useContext(EventContext)!;
	const [players, setPlayers]: [Players, Function] = useState({p1: null, p2: null});
	const [defy, setDefy]: [number | null, Function] = useState(null);
	const [setting, setSetting]: [Setting, Function] = useState({type: "menu", mode: "classic"});

	useEffect(() => {

		function goToDefy(defyInfo: any) {
			setDefy(defyInfo.senderId);
			setSetting({type: "online", mode: defyInfo.mode});
		}
		socket.on("goDefy", goToDefy)

		return (() => {
			socket.off("goDefy", goToDefy)
		})
	}, [socket, setDefy, setSetting])

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
				return (<MatchMaking mode={setting.mode} setSetting={setSetting} setPlayers={setPlayers} defy={defy} setDefy={setDefy}/>);
		}
	}

	return (
		<>
			<div className="canvas_wrap">
				{players.p1? <PlayerCard player={players.p1}/> 
					: <Paper className="player_card"><div className="el_pongo">PONGO</div></Paper>}
				{modeSelect()}
				{players.p2? <PlayerCard player={players.p2}/>
					: <Paper className="player_card"><div className="el_pongo">PONGO</div></Paper>}
			</div>
			{setting.type !== "menu" &&
				<div className="flex justify-center"><button onClick={returnToMenu}>
					<Paper className="forfeit_button font-bold">MENU</Paper>
				</button></div>}
		</>
	)
}
