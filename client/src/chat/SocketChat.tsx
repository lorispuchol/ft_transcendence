import { List, ListItem, ListItemText } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./chat.css";
import { server_url } from "../utils/Request";
import Loading from "../utils/Loading";

function Messages({ socket }: any) {
	const [messages, setMessages] = useState({});

	useEffect(() => {
		function messageListener(message: any) {
			setMessages((prevMessages) => {
				const newMessages: any = {...prevMessages};
				newMessages[message.id] = message;
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
		}}
	  >
			{[...Object.values(messages)]
       		.sort((a: any, b: any) => a.time - b.time)
			   .map((message: any) => (
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

function MessageInput({ socket }: any) {
	const [value, setValue] = useState('');

	function submitForm(e: any) {
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

export default function SocketChat() {

	const [socket, setSocket]: [any, any] = useState(null);

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
			</div>
		</>
	);
}
