import { Socket, io } from "socket.io-client";
import Loading from "../../../utils/Loading";
import { useEffect, useState } from "react";
import { server_url } from "../../../utils/Request";
import { Setting } from "../Game";

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
		
		return () => {newSocket.close()};
	}, [setSocket, setting, setPlayers])
	if (!socket)
		return (<Loading />);

	return (
		<div>
			<div>online</div>
			<div>defy: {defy}</div>
		</div>
	)
}
