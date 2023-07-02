import { Socket, io } from "socket.io-client";
import { GetRequest, server_url } from "../utils/Request";
import { useEffect, useState } from "react";

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

		function deleteMessageListener(messageId: any) {
			setMessages((prevMessages) => {
				const newMessages: any = {...prevMessages};
				delete newMessages[messageId];
				return newMessages;
			});
		};

		socket.on('message', messageListener);
		socket.on('deleteMessage', deleteMessageListener);
		socket.emit('getMessages');
		return () => {
			socket.off('message', messageListener);
			socket.off('deleteMessage', deleteMessageListener);
		};
	}, [socket]);
	return (
		<div>
			{[...Object.values(messages)]
       		.sort((a: any, b: any) => a.time - b.time)
        	.map((message: any) => (
        		<div key={message.id}	title={`Sent at ${new Date(message.time).toLocaleTimeString()}`}>
        			<span className="user">{message.user}:</span>
            		<span className="message">{" " + message.value + " - "}</span>
            		<span className="date">{new Date(message.time).toLocaleTimeString()}</span>
          		</div>
        	))}
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

export default function Chat() {
	
	const [socket, setSocket]: [any, any] = useState(null);

	useEffect(() => {
		const token = localStorage.getItem("token");
		const option = {
			transportOptions: {
				polling: {
					extraHeaders: {
						token: token
					}
				}
			}
		};
		const newSocket = io("http://" + process.env.REACT_APP_SERVER_HOST + ":" + "8080", option);
		setSocket(newSocket);
		return () => {newSocket.close()};
	}, [setSocket]);

	return (
		<div>
		  <header>
			React Chat
		  </header>
		  { socket ? (
			<div>
			  <Messages socket={socket} />
			  <MessageInput socket={socket} />
			</div>
		  ) : (
			<div>Not Connected</div>
		  )}
		</div>
	  );

	return (
		<>
			chat
		</>
	);
}