import { Socket, io } from "socket.io-client";
import { useEffect, useState } from "react";
import { server_url } from "../../../utils/Request";
import { Players } from "../Game";
import { CircularProgress } from "@mui/material";
import OnlineGame from "./OnlineGame";
import OnlineSplatong from "./onlineSplatong";
import '../Game.scss';
import { useNavigate } from "react-router-dom";

interface Props {
	mode: string,
	setPlayers: Function,
	defy: number | null,
	setDefy: Function,
	setScore: Function
}

export default function MatchMaking({ mode, setPlayers, defy, setDefy, setScore }: Props) {
	const [socket, setSocket]: [Socket | null, Function] = useState<Socket | null>(null);
	const [specMode, setSpecMode]: [string, Function] = useState("");
	const [opponent, setOpponent]: [boolean, Function] = useState(false);
	const [side, setSide]: [number, Function] = useState(1);
	const [specWinnner, setSpecwinner]: [number, Function] = useState(-1);
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		const option = { transportOptions: { polling: { extraHeaders: { token: token }}}};
		const newSocket: Socket = io(server_url + "/game", option);
		setSocket(newSocket);
		
		function notConnected () {
			if (mode === "spectate")
				navigate("/");
		}
		newSocket.on("disconnect", notConnected);

		function handleSearch(players: Players) {
			setPlayers(players);
			//left=1  right=-1
			setSide(players.side);
			setOpponent(true);
		}
		newSocket.on("matchmaking", handleSearch);

		function handleSpectate(specInfo: {players: Players, mode: string, winner: number}) {
			setPlayers(specInfo.players);
			setSide(0);
			setSpecwinner(specInfo.winner);
			setSpecMode(specInfo.mode);
			setOpponent(true);
		}
		newSocket.on("goSpectate", handleSpectate);

		return () => {
			newSocket.off("matchmaking", handleSearch);
			newSocket.off("goSpectate", handleSpectate);
			newSocket.close();
		};
	}, [navigate, setPlayers, setSide, mode]);

	useEffect(() => {
		if (!socket)
			return ;
		if (mode === "spectate")
		{
			if (defy)
			{
				socket.emit("waitSpectate", defy);
				setDefy(null);
			}
		}
		else if (defy)
		{
			socket.emit("defy", {defyId: defy, mode});
			setDefy(null);
		}
		else
			socket.emit("search", mode);
	}, [socket, setDefy, defy, mode])
	
	if (!opponent)
		return (
			<div className="wait_wrapper">
				<div className="wait_match">
					<div className="m-[1vw]"/>
					<CircularProgress size={"5vw"}/>
					<div>waiting for opponent</div>
				</div>
			</div>
		);
	
	return (
		<div>
			{ mode === "classic" || specMode === "classic" ?
				<OnlineGame socket={socket!} setScore={setScore} side={side} specWinner={specWinnner}/>
			:
				<OnlineSplatong socket={socket!} setScore={setScore} side={side} specWinner={specWinnner}/>
			}
		</div>
	)
}
