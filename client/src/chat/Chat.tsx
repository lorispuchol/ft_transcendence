import { useEffect, useState } from "react";
import Chatting from "./Chatting";
import { GetRequest, server_url } from "../utils/Request";
import Loading from "../utils/Loading";
import ErrorHandling from "../utils/Error";
import { useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import { Socket, io } from "socket.io-client";


export enum ChanMode {
	PUBLIC = "public",
	PROTECTED = "protected",
	PRIVATE = "private",
	DM = "dm"
}
interface ChannelData {
	id: number, 
	name: string,
	mode: string,
	password: string | null;
}
interface Response {
	status: string | number,
	data?: ChannelData[],
	error?: string,
}

interface focusConvProps {
	chanName?: string;
	chans?: ChannelData[]
	focusConv: string,
	setFocusConv: Function,
}

function ListConv({focusConv, setFocusConv}: focusConvProps) {
	
	//focusConv pour entourer sur la conv actuelle
	const [response, setResponse]: [Response, Function] = useState({status: "loading"});
	useEffect(() => {
			GetRequest("/chat/getConvs").then((response) => setResponse(response));
	}, []);
	if (response.status === "loading")
		return (<Loading />);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);

	const dms: ChannelData[]  = response.data!.filter((conv) => conv.mode === ChanMode.DM)
	const chans: ChannelData[]  = response.data!.filter((conv) => conv.mode !== ChanMode.DM)
	return (
		<div /*className="list-button-conv"*/>
			{
				dms.map((chan) => (
					<Button
						key={chan.name}
						onClick={() => setFocusConv(chan.name)}
					>
						{chan.name}
					</Button>
				))
			}
			{
				chans.map((chan) => (
					<Button
						key={chan.name}
						onClick={() => setFocusConv(chan.name)}
					>
						{chan.name}
					</Button>
				))
				
			}
		</div>
	)
}

export default function Chat() {
	const location = useLocation();
	const [focusConv, setFocusConv]: [string, Function] = useState(location.state?.to);

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
		<div /*className="chat-page"*/>
			<header>
				Chat
			</header>
			
			<ListConv focusConv={focusConv} setFocusConv={setFocusConv} />
			<strong>focus conv: {focusConv}</strong>
			{focusConv ? 
				<Chatting chan={focusConv} socket={socket} />
				: null // return a big button to create a channel
			}		
		</div>

	  );
}