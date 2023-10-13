import { useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { EventContext } from "../../utils/Context";
import { Circle } from "@mui/icons-material";

interface UserStatusprops {
	userId: number
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

export default function UserStatus({ userId }: UserStatusprops) {
	const socket: Socket = useContext(EventContext)!;
	const [userStatus, setUserStatus]: [string, Function] = useState("loading");

	useEffect(() => {
		function getStatus(status: string) {
			setUserStatus(status)
		}

		socket.on('status/' + userId, getStatus);
		socket.emit('getStatus', userId);

		return () => {socket.off('status/' + userId, getStatus)};
	}, [socket, userId])

	if (userStatus === "loading")
		return (<Circle sx={{color:renderColor("")}}/>);

	return (
		<Circle sx={{color:renderColor(userStatus)}} />
	);
}
