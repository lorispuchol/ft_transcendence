import { List, ListItem, ListItemText } from "@mui/material";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import "./chat.css";
import { server_url } from "../utils/Request";
import Loading from "../utils/Loading";

interface Message {
	id: number;
	user: string;
	value: string;
	time: number;
}

// interface Channel {
// 	id: number, 
// 	name: string,
// 	mode: string,
// 	password: string | null;
// }

interface SocketProps {
	socket: Socket,
}

function Messages({ socket }: SocketProps) {
	const [messages, setMessages]: [Message[], Function] = useState([]);

	useEffect(() => {
		function messageListener(message: Message) {
			setMessages((prevMessages: Message[]) => {
				const newMessages: Message[] = [...prevMessages, message];
				return newMessages;
			});
		};
		socket.on('message', messageListener);
		socket.emit('getMessages');
		return () => {socket.off('message', messageListener);};
	}, [socket]);

	const messageRef = useRef<null | HTMLDivElement>(null);
	useEffect(() => {
		messageRef.current?.scrollIntoView();
	}, [messages]);

	return (
		<div>
			<List
				sx={{
		  			width: '100%',
		  			maxWidth: 800,
		  			bgcolor: 'background.paper',
		  			position: 'relative',
		  			overflow: 'auto',
		  			maxHeight: 600,
		  			'& ul': { padding: 0 },
				}}>
			{messages.map((message: Message) => (
				<ListItem key={message.id}	title={`Sent at ${new Date(message.time).toLocaleTimeString()}`}>
					<div className="user-column">
        				<span className="user">{message.user + " :"}</span>
					</div>
            		<ListItemText className="message">{message.value}</ListItemText>
            		<span className="date">{new Date(message.time).toLocaleTimeString()}</span>
          		</ListItem>
        	))}
			<div ref={messageRef} />
			</List>
		</div>
	)
}

function MessageInput({ socket }: SocketProps) {
	const [value, setValue] = useState('');

	function submitForm(e: FormEvent) {
		e.preventDefault();
		socket.emit('message', value);
		setValue('');
	};

	return (
		<form onSubmit={submitForm}>
			<input autoFocus value={value} placeholder="type" onChange={(e) => {setValue(e.currentTarget.value);}} />
		</form>
	);
}

// function Discussions({ socket }: SocketProps) {
	
// 	const [discussions, setDiscussions]: [Channel[], Function] = useState([]);

// 	useEffect(() => {
// 		function discussionGetter(discussion: Channel) {
// 			setDiscussions((prevDiscussions: Channel[]) => {
// 				const newDiscussion: Channel[] = [...prevDiscussions, discussion];
// 				return newDiscussion;
// 			});
// 		};
// 		socket.on('discussions', discussionGetter);
// 		socket.emit('getDiscussions');
// 		return () => {socket.off('discussions', discussionGetter);};
// 	}, [socket]);
// 	return (
// 		<div>
// 			{discussions.map((discussion) => discussion.name)}
// 		</div>
// 	)
// }

export default function SocketChat() {

	const [socket, setSocket]: [Socket | null, Function] = useState(null);

	useEffect(() => {
		const token = localStorage.getItem("token");
		const option = { transportOptions: { polling: { extraHeaders: { token: token }}}};
		const newSocket = io(server_url + "/chat", option);
		setSocket(newSocket);
		return () => {newSocket.close()};
	}, [setSocket]);

	if (!socket)
		return (<Loading />)
	
	return (
		<>
			<div>
				<Messages socket={socket} />
				<MessageInput socket={socket} />
				{/* <Discussions socket={socket} /> */}
			</div>
		</>
	);
}
