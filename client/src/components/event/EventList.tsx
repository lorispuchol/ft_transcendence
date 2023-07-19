import { useEffect, useState } from "react";
import { server_url } from "../../utils/Request";
import { io } from "socket.io-client";
import Loading from "../../utils/Loading";

function Events({ socket }: any) {
	const [events, setEvents]: [any, any] = useState({});
	
	useEffect(() => {
		function eventListener(event: any) {
			setEvents((prevEvents: any) => {
				const newEvents: any = {...prevEvents};
				newEvents[event.id] = event;
				return newEvents;
			});
		}
		socket.on('event', eventListener);
		socket.emit('getEvents');
		return () => socket.off('event', eventListener);
	}, [socket]);

	return (
		<ul>
			{[...Object.values(events)].map((event: any) => (
				<li key={event.id}>{event.login}</li>
			))}
		</ul>
	);
}

export default function EventList() {

	const [socket, setSocket]: [any, any] = useState(null);

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
