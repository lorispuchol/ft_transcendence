import { ReactElement, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { Badge, Button, ClickAwayListener, Divider, IconButton, List, ListItem, ListItemAvatar, Paper, Popper } from "@mui/material";
import { EmojiPeople, MarkChatUnread, MarkUnreadChatAlt, Message, Notifications, VideogameAsset } from "@mui/icons-material";
import EventButton from "./EventButton";
import { EventContext, UserContext } from "../../utils/Context";
import { useNavigate } from "react-router-dom";

interface Event {
	type: string,
	sender: string,
}

interface RenderIconProps {
	e: Event
}

interface SocketProps {
	socket: Socket,
}

interface EventWrapperProps {
	children: ReactElement,
	numberOfEvent: number,
}

function RenderIcon({e}: RenderIconProps) {
	
	const user = useContext(UserContext)
	const navigate = useNavigate();

	function goToMsg() {
		console.log("trynavigate")
		navigate("/chat", {replace: false, state: {to: e.sender.replace("#", "")}})
	}

	switch(e.type) {
		case 'friendRequest':
			return (<EmojiPeople />);
		case 'gameRequest':
			return (<VideogameAsset />);
		case 'message':
			return (<Button onClick={goToMsg}><MarkChatUnread /></Button>)
		default:
			return (<strong>error: type not found</strong>)
	}
}

function Events({ socket }: SocketProps) {
	const user = useContext(UserContext);
	const [events, setEvents]: [Event[], Function] = useState([]);

	useEffect(() => {
		function eventListener(event: Event) {
			setEvents((prevEvents: Event[]) => {
				if (prevEvents.find((value) => value.sender + value.type === event.sender + event.type))
					return [...prevEvents];
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
							<ListItemAvatar><RenderIcon e={event} /></ListItemAvatar>
							{event.sender.replace("+", "").replace(user!, "")}
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
	const socket = useContext(EventContext);

	return (
		<div className={className}>
			<Events socket={socket!}/>
		</div>
	);
}
