import { Socket, io } from "socket.io-client";
import Loading from "../../utils/Loading";
import LocalGame from "./local/LocalGame";
import { useEffect, useState } from "react";
import { server_url } from "../../utils/Request";
import { Setting } from "./Game";

interface Props {
	setting: Setting,
	setSetting: Function,
	setPlayers: Function,
	defy: string | null,
}

export default function MatchMaking({ setting, setPlayers, setSetting, defy }: Props) {
	const [socket, setSocket]: [Socket | null, Function] = useState(null);

	useEffect(() => {
		const token = localStorage.getItem("token");
		const option = { transportOptions: { polling: { extraHeaders: { token: token }}}};
		const newSocket = io(server_url + "/game", option);
		setSocket(newSocket);
		if (setting.type === "local")
			setPlayers({p1: {score:0, avatar: "", username: "player 1"}, p2: {score:0, avatar: "", username: "player 2"}})
		
		return () => {newSocket.close()};
	}, [setSocket, setting, setPlayers])
	if (!socket)
		return (<Loading />);

	function returnToMenu() {
		setSetting({type: "menu", mode: setting.mode});
		setPlayers({p1: null, p2: null});
	}

	if (setting.type === "local")
	{
		return (<LocalGame setPlayers={setPlayers} returnToMenu={returnToMenu} />)
	}
	return (<strong>online</strong>)
}
