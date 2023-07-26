import { ReactElement, useContext, useEffect, useState } from "react";
import { server_url } from "../../utils/Request";
import { Socket, io } from "socket.io-client";
import Loading from "../../utils/Loading";
import { Badge, Button, ClickAwayListener, Divider, IconButton, List, ListItem, ListItemAvatar, Paper, Popper } from "@mui/material";
import { Close, Done, EmojiPeople, Message, Notifications, VideogameAsset } from "@mui/icons-material";
import EventButton from "./EventButton";
import { EventContext } from "../../utils/Context";

interface Event {
	type: string,
	sender: string,
}

interface SocketProps {
	socket: Socket,
}

interface EventWrapperProps {
	children: ReactElement,
	numberOfEvent: number,
}

function renderIcon(type: string) {
	switch(type) {
		case 'friendRequest':
			return (<EmojiPeople />);
		case 'gameRequest':
			return (<VideogameAsset />);
		case 'privateMessage':
			return (<Message />)
		default:
			return (<strong>error: type not found</strong>)
	}
}

function Events({ socket }: SocketProps) {
	const [events, setEvents]: [Event[], Function] = useState([]);

	useEffect(() => {
		function eventListener(event: Event) {
			setEvents((prevEvents: Event[]) => {
				const newEvents: Event[] = [...prevEvents, event];
				return newEvents;
			});
		}
		function eventDeleter(event: Event) {
			setEvents((prevEvents: Event[]) => {
				const index = prevEvents.indexOf(event);
				prevEvents.splice(index, 1);
				return [...prevEvents];
			});
		}

		socket.on('event', eventListener);
		socket.on('deleteEvent', eventDeleter);
		socket.emit('getEvents');
		return () => {socket.off('event', eventListener)};
	}, [socket]);

	return (
		<EventWrapper numberOfEvent={events.length}>
			<Paper><List sx={{
		  			overflow: 'auto',
		  			maxHeight: 244,
		  			'& ul': { padding: 0 },
				}}>
				{events.map((event: Event, index: number) => (
					<div key={event.type + event.sender}>
						<ListItem>
							<ListItemAvatar>{renderIcon(event.type)}</ListItemAvatar>
							{event.sender}
						</ListItem>
						<EventButton event={event}/>
						{index + 1 !== events.length? <Divider /> : null}
					</div>
				))}
			</List></Paper>
		</EventWrapper>
	);
}

function EventWrapper({ children, numberOfEvent } : EventWrapperProps) {
	const [open, setOPen]: [boolean, Function] = useState(false);
	const [anchor, setAnchor]: [HTMLElement | null, Function] = useState(null);

	function handleClick(event: React.MouseEvent) {
		setOPen((prevOpen: boolean) => !prevOpen);
		setAnchor(event.currentTarget);
	}

	function handleClose() {
		setOPen(false);
	}

	return (
		<>
			<IconButton onClick={handleClick}>
				<Badge badgeContent={numberOfEvent} color='error'><Notifications /></Badge>
			</IconButton>
			<Popper open={open} anchorEl={anchor}>
				<ClickAwayListener onClickAway={handleClose}>
					{children}
				</ClickAwayListener>
			</Popper>
		</>
	)
}

export default function EventList({ className }: any) {

	// const [socket, setSocket]: [Socket | null, Function] = useState(null);

	// useEffect(() => {
	// 	const token = localStorage.getItem("token");
	// 	const option = { transportOptions: { polling: { extraHeaders: { token: token }}}};
	// 	const newSocket = io(server_url + "/event", option);
	// 	setSocket(newSocket);
	// 	return () => {newSocket.close()};
	// }, [setSocket]);

	// if (!socket)
	// 	return (<Loading />);
	const socket = useContext(EventContext);
	return (
		<div className={className}>
			<Events socket={socket!}/>
		</div>
	);
}
