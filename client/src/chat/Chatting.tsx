import { List, ListItem, ListItemText } from "@mui/material";
import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import "./chat.css";
import { GetRequest } from "../utils/Request";
import Loading from "../utils/Loading";
import ErrorHandling from "../utils/Error";
import { MessageData } from "./interfaceData";
import { SocketChatContext } from "../utils/Context";
import ChannelNav from "./ChannelNav";

interface ChattingProps {
	chan: string;
}

interface Response {
	status: string | number,
	data?: MessageData[],
	error?: string,
}

interface MessagesProps {
	chan: string,
}

interface MessagesListenerProps {
	chan: string,
	msg: MessageData,
}

function Messages({chan}: MessagesProps) {
	
	const [response, setResponse]: [Response, Function] = useState({status: "loading"});
	const [messages, setMessages]: [MessageData[], Function] = useState([]);
	const socket: Socket | null = useContext(SocketChatContext);


	useEffect(() => {
		GetRequest("/chat/getMessages/" + chan).then((res) => {setResponse(res); setMessages(res.data)})
		function messageListener(message: MessagesListenerProps) {
			if (chan === message.chan) {
				setMessages((prevMessages: MessageData[]) => {
					const newMessages: MessageData[] = [...prevMessages, message.msg];
					return newMessages;
				});
			}
		};
		socket!.on('message', messageListener);
		return () => {socket!.off('message', messageListener);};
	}, [chan, socket])

	const messageRef = useRef<null | HTMLDivElement>(null);
	useEffect(() => {
		messageRef.current?.scrollIntoView();
	}, [messages]);

	if (response.status === "loading")
		return (<Loading />);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);
	
	messages.sort((a, b) =>
		(new Date(a.date) as any) - (new Date(b.date) as any)
	)

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
				<ListItem key={message.id}	title={`Sent at ${new Date(message.date).toLocaleTimeString()}`}>
					<div /*className="user-column"*/>
        				<span className="user">{message.sender.username + " :"}</span>
					</div>
            		<ListItemText className="message">{message.content}</ListItemText>
            		<span className="date">{new Date(message.date).toLocaleTimeString()}</span>
          		</ListItem>
        	))}
			<div ref={messageRef} />
			</List>
		</div>
	)
}

function MessageInput({ chan }: MessagesProps) {
	const [value, setValue] = useState('');
	const socket = useContext(SocketChatContext);

	function submitForm(e: FormEvent) {
		e.preventDefault();
		socket!.emit('message',chan, value);
		setValue('');
	};

	return (
		<form onSubmit={submitForm}>
			<input autoFocus value={value} placeholder="type" onChange={(e) => {setValue(e.currentTarget.value);}} />
		</form>
	);
}

export default function Chatting({chan}: ChattingProps ) {

	return (
		<>
			<strong>chating in: {chan}</strong>
			<Messages chan={chan} />
			<MessageInput chan={chan} />
		</>
	);
}
