import { useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { EventContext } from "../utils/Context";
import { Circle } from "@mui/icons-material";

interface UserStatusprops {
	login: string
}

function renderColor(status: string) {
	switch(status) {
		case 'online':
			return "green";
		case 'blocked':
			return "orange";
		case 'offline':
			return "red";
		default:
			return "red"
	}
}

export default function UserStatus({ login }: UserStatusprops) {
	const socket: Socket = useContext(EventContext)!;
	const [userStatus, setUserStatus]: [string, Function] = useState("loading");

	useEffect(() => {
		socket.on('status/' + login, (status: string) => setUserStatus(status));
		socket.emit('getStatus', login);
	}, [socket, login])

	if (userStatus === "loading")
		return (<Circle sx={{color:renderColor("")}}/>);

	return (
		<Circle sx={{color:renderColor(userStatus)}} />
	);
}
