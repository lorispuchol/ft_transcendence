import { useEffect, useState } from "react";
import { server_url } from "../../utils/Request";
import { Socket, io } from "socket.io-client";
import Loading from "../../utils/Loading";
import { Avatar, List, ListItem, ListItemAvatar } from "@mui/material";
import { Diversity1Rounded } from "@mui/icons-material";

interface Event {
	type: string,
	sender: string,
}

interface SocketProps {
	socket: Socket,
}

function renderIcon(type: string) {
	switch(type) {
		case 'friendRequest':
			return (<Diversity1Rounded />);
		default:
			return (<strong>error: type not found</strong>)
	}
}

function Events({ socket }: SocketProps) {
	const [events, setEvents]: [Event[], Function] = useState([]);
	console.log(typeof(socket));

	useEffect(() => {
		function eventListener(event: Event) {
			setEvents((prevEvents: Event[]) => {
				const newEvents: Event[] = [...prevEvents, event];
				return newEvents;
			});
		}
		socket.on('event', eventListener);
		socket.emit('getEvents');
		return () => {socket.off('event', eventListener)};
	}, [socket]);

	return (
		<List>
			{events.map((event: Event) => (
				<ListItem key={event.sender}>
					<ListItemAvatar><Avatar>{renderIcon(event.type)}</Avatar></ListItemAvatar>
					{event.sender}
				</ListItem>
			))}
		</List>
	);
}

export default function EventList() {

	const [socket, setSocket]: [Socket | null, Function] = useState(null);

	useEffect(() => {
		const token = localStorage.getItem("token");
		const option = { transportOptions: { polling: { extraHeaders: { token: token }}}};
		const newSocket = io(server_url + "/event", option);
		setSocket(newSocket);
		return () => {newSocket.close()};
	}, [setSocket]);

	if (!socket)
		return (<Loading />);

	return (
		<>
			<strong><u>event:</u></strong>
			<Events socket={socket} />
		</>
	);
}
