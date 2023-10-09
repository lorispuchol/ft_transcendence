import { Socket, io } from "socket.io-client";
import Loading from "../../../utils/Loading";
import { useContext, useEffect, useState } from "react";
import { server_url } from "../../../utils/Request";
import { Players, Setting } from "../Game";
import { CircularProgress } from "@mui/material";
import OnlineGame from "./OnlineGame";
import { UserContext } from "../../../utils/Context";

interface Props {
	setting: Setting,
	setSetting: Function,
	setPlayers: Function,
	defy: number | null,
}

export default function MatchMaking({ setting, setPlayers, setSetting, defy }: Props) {
	const [socket, setSocket]: [Socket | null, Function] = useState(null);
	const [openent, setOpenent]: [boolean, Function] = useState(false);
	const [side, setSide]: [number, Function] = useState(1);
	const currentMode: string = setting.mode;
	const username = useContext(UserContext);

	useEffect(() => {
		const token = localStorage.getItem("token");
		const option = { transportOptions: { polling: { extraHeaders: { token: token }}}};
		const newSocket = io(server_url + "/game", option);
		setSocket(newSocket);
		
		function handleSearch(players: Players | null) {
			if (!players)
				setSetting({type: "menu", mode: currentMode});
			else
			{
				setPlayers(players);
				setOpenent(true);
				if (players.p1?.username === username)
					setSide(1);
				else
					setSide(2);
			}
		}

		newSocket.on("matchmaking", handleSearch);
		newSocket.emit("search", defy);

		return () => {
			newSocket.close();
		};
	}, [setSocket, defy, setPlayers, setSetting, setSide, username, currentMode])
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
			<OnlineGame socket={socket} side={side} />
		</div>
	)
}
