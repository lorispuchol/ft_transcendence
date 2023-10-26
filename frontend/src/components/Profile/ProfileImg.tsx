import { useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { EventContext } from "../../utils/Context";

import './ProfileImg.scss'

interface UserData {
	userId: number,
	userAvatar: string
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

export default function ProfileImg(props: UserData) {
	const socket: Socket = useContext(EventContext)!;
	const [userStatus, setUserStatus]: [string, Function] = useState("loading");

	useEffect(() => {
		function getStatus(status: string) {
			setUserStatus(status)
		}

		socket.on('status/' + props.userId, getStatus);
		socket.emit('getStatus', props.userId);

		return () => {socket.off('status/' + props.userId, getStatus)};
	}, [socket, props.userId])

	if (renderColor(userStatus) === "green")
		return (
			<img className="Av_border_green" src={(props.userAvatar)} alt="profileImg" />
		);
	else if (renderColor(userStatus) === "orange")
		return (
			<img className="Av_border_orange" src={(props.userAvatar)} alt="profileImg" />
		);
	else
			return (
			<img className="Av_border_red" src={(props.userAvatar)} alt="profileImg" />
		);
}