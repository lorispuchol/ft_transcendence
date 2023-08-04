import { List, ListItem, ListItemText } from "@mui/material";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import "./chat.css";
import { GetRequest, server_url } from "../utils/Request";
import Loading from "../utils/Loading";
import ErrorHandling from "../utils/Error";

interface ChattingProps {
	chan: string;
	socket: Socket
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
interface MessagesProps {
	chan: string,
	socket: Socket,
}

function ExMessages({ socket }: SocketProps) {
	const [messages, setMessages]: [MessageData[], Function] = useState([]);

	useEffect(() => {
		function messageListener(message: MessageData) {
			setMessages((prevMessages: MessageData[]) => {
				const newMessages: MessageData[] = [...prevMessages, message];
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
			{messages.map((message: MessageData) => (
				<ListItem key={message.id}	title={`Sent at ${new Date(message.time).toLocaleTimeString()}`}>
					<div /*className="user-column"*/>
        				<span className="user">{message.sender.username + " :"}</span>
					</div>
            		<ListItemText className="message">{message.content}</ListItemText>
            		<span className="date">{new Date(message.time).toLocaleTimeString()}</span>
          		</ListItem>
        	))}
			<div ref={messageRef} />
			</List>
		</div>
	)
}


function ExMessageInput({ socket }: SocketProps) {
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

function ExSocketChat({chan}: ChattingProps ) {

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
			{/* <ExMessages chan={chan} socket={socket} /> */}
			{/* <ExMessageInput socket={socket} /> */}
		</div>
	);
}


function Messages({chan, socket}: MessagesProps) {
	
	const [response, setResponse]: [Response, Function] = useState({status: "loading"});
	const [messages, setMessages]: [MessageData[], Function] = useState([]);

	useEffect(() => {
		GetRequest("/chat/getMessages/" + chan).then((res) => {setResponse(res); setMessages(res.data)})
		function messageListener(message: MessageData) {
			setMessages((prevMessages: MessageData[]) => {
				const newMessages: MessageData[] = [...prevMessages, message];
				return newMessages;
			});
		};
		socket.on('message', messageListener);
		return () => {socket.off('message', messageListener);};
	}, [chan, socket])

	const messageRef = useRef<null | HTMLDivElement>(null);
	useEffect(() => {
		messageRef.current?.scrollIntoView();
	}, [messages]);

	if (response.status === "loading")
		return (<Loading />);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);

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
			{messages.map((message: MessageData) => (
				<ListItem key={message.id}	title={`Sent at ${new Date(message.time).toLocaleTimeString()}`}>
					<div /*className="user-column"*/>
        				<span className="user">{message.sender.username + " :"}</span>
					</div>
            		<ListItemText className="message">{message.content}</ListItemText>
            		<span className="date">{new Date(message.time).toLocaleTimeString()}</span>
          		</ListItem>
        	))}
			<div ref={messageRef} />
			</List>
		</div>
	)
	// return (
	// 	<div>
	// 		<strong>{chan}</strong>
	// 		<div>
	// 			<ul>
	// 				{response.data!.map((msg) => <li>{msg.sender.username + ": " + msg.content}</li>)}
	// 			</ul>
	// 		</div>
	// 	</div>
	// )
}

function MessageInput({ chan, socket }: MessagesProps) {
	const [value, setValue] = useState('');
	const [chanName, setChanName] = useState(chan);


	console.log(value);
	function submitForm(e: FormEvent) {
		e.preventDefault();
		socket.emit('message', value, chanName);
		setValue('');
	};

	return (
		<form onSubmit={submitForm}>
			<input autoFocus value={value} placeholder="type" onChange={(e) => {setValue(e.currentTarget.value);}} />
		</form>
	);
}




export default function Chatting({chan, socket}: ChattingProps ) {

	return (
		<div>
			<strong>chating to: {chan}</strong>
			<Messages chan={chan} socket={socket} />
			<MessageInput chan={chan} socket={socket} />
		</div>
	);
}
