import { List, ListItem, ListItemText } from "@mui/material";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import "./chat.css";
import { GetRequest, server_url } from "../utils/Request";
import Loading from "../utils/Loading";

interface Message {
	id: number;
	user: string;
	value: string;
	time: number;
}

interface ChattingProps {
	chan: string | null;
}

interface UserData {
	avatar: string | null,
	login: string,
	username: string,
	nb_victory: number,
	nb_defeat: number,
}

interface ChannelData {
	id: number, 
	name: string,
	mode: string,
	password: string | null;
}

interface MessageData {
	id: number;
	sender: UserData;
	channel: ChannelData;
	content: string;
	time: Date;
}

interface Response {
	status: string | number,
	data?: MessageData[],
	error?: string,
}

interface SocketProps {
	socket: Socket,
}

// function Messages({ socket }: SocketProps) {
// 	const [messages, setMessages]: [Message[], Function] = useState([]);

// 	useEffect(() => {
// 		function messageListener(message: Message) {
// 			setMessages((prevMessages: Message[]) => {
// 				const newMessages: Message[] = [...prevMessages, message];
// 				return newMessages;
// 			});
// 		};
// 		socket.on('message', messageListener);
// 		socket.emit('getMessages');
// 		return () => {socket.off('message', messageListener);};
// 	}, [socket]);

// 	const messageRef = useRef<null | HTMLDivElement>(null);
// 	useEffect(() => {
// 		messageRef.current?.scrollIntoView();
// 	}, [messages]);

// 	return (
// 		<div>
// 			<List
// 				sx={{
// 		  			width: '100%',
// 		  			maxWidth: 800,
// 		  			bgcolor: 'background.paper',
// 		  			position: 'relative',
// 		  			overflow: 'auto',
// 		  			maxHeight: 600,
// 		  			'& ul': { padding: 0 },
// 				}}>
// 			{messages.map((message: Message) => (
// 				<ListItem key={message.id}	title={`Sent at ${new Date(message.time).toLocaleTimeString()}`}>
// 					<div className="user-column">
//         				<span className="user">{message.user + " :"}</span>
// 					</div>
//             		<ListItemText className="message">{message.value}</ListItemText>
//             		<span className="date">{new Date(message.time).toLocaleTimeString()}</span>
//           		</ListItem>
//         	))}
// 			<div ref={messageRef} />
// 			</List>
// 		</div>
// 	)
// }

function Messages({chan}: any) {
	
	const [response, setResponse]: [Response, Function] = useState({status: "loading"});

	useEffect(() => {
		if (chan)
			GetRequest("/chat/getMessages/" + chan).then((res) => setResponse(res))
	}, [chan])

	if (!response.data)
		return null

	return (
		<div>
			<strong>{chan}</strong>
			<div>
				<ul>
					{response.data.map((msg) => <li>{msg.sender.username + ": " + msg.content}</li>)}
				</ul>
			</div>
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


export default function Chatting({chan}: ChattingProps ) {


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
		<div>
			<Messages chan={chan} />
			<MessageInput socket={socket} />
		</div>
	);
}
