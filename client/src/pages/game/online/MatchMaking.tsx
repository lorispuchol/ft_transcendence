import { Socket, io } from "socket.io-client";
import Loading from "../../../utils/Loading";
import { useEffect, useState } from "react";
import { server_url } from "../../../utils/Request";
import { Players, Setting } from "../Game";
import { CircularProgress } from "@mui/material";

interface Props {
	setting: Setting,
	setSetting: Function,
	setPlayers: Function,
	defy: string | null,
}

interface Player {
	score: number,
	avatar: string,
	username: string,
}

export default function MatchMaking({ setting, setPlayers, setSetting, defy }: Props) {
	const [socket, setSocket]: [Socket | null, Function] = useState(null);
	const [openent, setOpenent]: [boolean, Function] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem("token");
		const option = { transportOptions: { polling: { extraHeaders: { token: token }}}};
		const newSocket = io(server_url + "/game", option);
		setSocket(newSocket);
		
		function handleSearch(players: Players | null) {
			if (!players)
				setSetting({type: "menu", mode: setting.mode});
			else
			{
				setPlayers(players);
				setOpenent(true);
			}
		}

		newSocket.on("matchmaking", handleSearch);
		newSocket.emit("search", defy);

		return () => {
			newSocket.close();
		};
	}, [setSocket])
	if (!socket)
		return (<Loading />);
	
	if (!openent)
		return (
			<div>
				<CircularProgress />
				<div>waiting for openent</div>
			</div>
		);
	
	return (
		<div>
			<div>online</div>
			<div>defy: {defy}</div>
		</div>
	)
}
