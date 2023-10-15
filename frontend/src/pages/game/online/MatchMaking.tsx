import { Socket, io } from "socket.io-client";
import Loading from "../../../utils/Loading";
import { useContext, useEffect, useState } from "react";
import { server_url } from "../../../utils/Request";
import { Players } from "../Game";
import { Button, CircularProgress, Paper } from "@mui/material";
import OnlineGame from "./OnlineGame";
import { UserContext } from "../../../utils/Context";
import OnlineSplatong from "./onlineSplatong";

interface Props {
	mode: string,
	setSetting: Function,
	setPlayers: Function,
	defy: number | null,
	setDefy: Function,
	setScore: Function
}

export default function MatchMaking({ mode, setPlayers, setSetting, defy, setDefy, setScore }: Props) {
	const [socket, setSocket]: [Socket | null, Function] = useState(null);
	const [openent, setOpenent]: [boolean, Function] = useState(false);
	const [side, setSide]: [number, Function] = useState(1);
	const username = useContext(UserContext);

	useEffect(() => {
		const token = localStorage.getItem("token");
		const option = { transportOptions: { polling: { extraHeaders: { token: token }}}};
		const newSocket: Socket = io(server_url + "/game", option);
		setSocket(newSocket);
		
		function handleSearch(players: Players) {
			setPlayers(players);
			setOpenent(true);
			//left=1  right=-1
			setSide(players.side);
		}
		newSocket.on("matchmaking", handleSearch);
		if (defy)
		{
			newSocket.emit("defy", {defyId: defy, mode});
			setDefy(null);
		}
		else
			newSocket.emit("search", mode);

		return () => {
			newSocket.off("matchmaking", handleSearch);
			newSocket.close();
		};
	}, [setSocket, defy, setPlayers, setSetting, setSide, username, mode, setDefy]);
	function getState() {
		socket?.emit("getState");
	}
	function flush() {
		socket?.emit("flush");
	}
	if (!socket)
		return (<Loading />);
	
	if (!openent)
		return (
			<Paper>
				<CircularProgress />
				<div>waiting for openent</div>
				<Button color="error" onClick={getState}>get State</Button>
				<Button color="error" onClick={flush}>flush</Button>
			</Paper>
		);
	
	return (
		<div>
			{ mode === "classic" ?
				<OnlineGame socket={socket} setScore={setScore} side={side} />
			:
				<OnlineSplatong socket={socket} setScore={setScore} side={side} />
			}
		</div>
	)
}
