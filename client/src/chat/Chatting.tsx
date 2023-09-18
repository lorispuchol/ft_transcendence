import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import "./chat.scss";
import { GetRequest } from "../utils/Request";
import Loading from "../utils/Loading";
import ErrorHandling from "../utils/Error";
import { MessageData } from "./interfaceData";
import { SocketChatContext, UserContext } from "../utils/Context";
import { defaultAvatar } from "../pages/Profile/Profile";
import { Send } from "@mui/icons-material";

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
	const userName = useContext(UserContext);

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
		<div className="w-full flex flex-col overflow-hidden overflow-scroll px-5 mb-3">
			{messages.map((message: MessageData) => (
			<div key={message.id} className={`chat ${message.sender.username === userName ? 'chat-start' : 'chat-end'}`}>
				<div className="chat-image avatar">
					<div className="w-10 rounded-full">
						<img src={message.sender.avatar ? message.sender.avatar : defaultAvatar} alt={message.sender.username} />
					</div>
				</div>
				<div className="chat-header">
					{message.sender.username}
					<time className="text-xs opacity-50 mx-1">{new Date(message.date).toLocaleTimeString()}</time>
				</div>
				<div className="chat-bubble break-words">{message.content}</div>
			</div>
			))}
			<div ref={messageRef} />
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
			<button className="btn send-button rounded-full w-12" type="submit"><Send /></button>
		</form>
	);
}

export default function Chatting({chan}: ChattingProps ) {

	return (
		<div className="flex flex-col w-full items-center pb-3">
			<Messages chan={chan} />
			<MessageInput chan={chan} />
		</div>
	);
}
