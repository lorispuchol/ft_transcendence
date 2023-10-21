import './Game.scss';
import { Paper } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import GameMenu from "./GameMenu";
import bird from "./bird.png";
import MatchMaking from "./online/MatchMaking";
import LocalGame from './local/LocalGame';
import { GetRequest } from '../../utils/Request';
import { EventContext } from '../../utils/Context';
import LocalSplatong from './local/localSplatong';

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
	id: number,
	username: string,
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

function PlayerCard( { player, score }: { player: Player, score: number }) {
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

	}, [player, user.id]);

	return (
		<Paper className="player_card in_game_card">
			<img src={user.avatar} alt="avatar" />
			<div className="score">{score}</div>
			<strong className='score text-[2vw]'>{user.username}</strong>
			<div/>
		</Paper>
	);
}

export default function Game() {
	const socket = useContext(EventContext)!;
	const [players, setPlayers]: [Players, Function] = useState({p1: null, p2: null});
	const [score, setScore]: [{p1: number, p2: number}, Function] = useState({p1: 0, p2: 0});
	const [defy, setDefy]: [number | null, Function] = useState(null);
	const [setting, setSetting]: [Setting, Function] = useState({type: "menu", mode: "classic"});

	useEffect(() => {

		function goToDefy(defyInfo: any) {
			socket.emit("clear");
			setDefy(defyInfo.senderId);
			setSetting({type: "online", mode: defyInfo.mode});
		}
		socket.on("goDefy", goToDefy)

		function goSpectate(specId: number) {
			socket.emit("clear");
			setDefy(specId);
			setSetting({type: "online", mode: "spectate"});
		}
		socket.on("goSpectate", goSpectate);

		return (() => {
			socket.off("goDefy", goToDefy)
			socket.off("goSpectate", goSpectate);
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
				if (setting.mode === "classic")
					return (<LocalGame setPlayers={setPlayers} setScore={setScore}/>)
				return (<LocalSplatong setPlayers={setPlayers} setScore={setScore}/>);
			case "online":
				return (<MatchMaking mode={setting.mode} setPlayers={setPlayers}
					defy={defy} setDefy={setDefy} setScore={setScore}/>);
		}
	}

	return (
		<>
			<div className="canvas_wrap">
				{players.p1? <PlayerCard player={players.p1} score={score.p1}/> 
					: <Paper className="player_card"><div className="el_pongo">PONGO</div></Paper>}
				{modeSelect()}
				{players.p2? <PlayerCard player={players.p2} score={score.p2}/>
					: <Paper className="player_card"><div className="el_pongo">PONGO</div></Paper>}
			</div>
			{setting.type !== "menu" &&
				<div className="flex justify-center"><button onClick={returnToMenu}>
					<Paper className="forfeit_button font-bold">MENU</Paper>
				</button></div>}
		</>
	)
}
