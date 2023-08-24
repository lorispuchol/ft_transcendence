import { useContext, useEffect, useState } from "react";
import Chatting from "./Chatting";
import { GetRequest, server_url } from "../utils/Request";
import Loading from "../utils/Loading";
import ErrorHandling from "../utils/Error";
import { useLocation } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import './chat.css'
import { ChanMode, ChannelData, MessageData, ParticipantData } from "./interfaceData";
import { SocketChatContext, UserContext } from "../utils/Context";
import ChannelNav from "./ChannelNav";
import { Avatar } from "@mui/material";

interface Response {
	status: string | number,
	data?: ChannelData[],
	error?: string,
}

interface ResImg {
	status: string | number,
	data?: FormData | null, // || Buffer || string 
	error?: string,
}
interface focusConvProps {
	chanName?: string;
	chans?: ChannelData[]
	focusConv: string,
	setFocusConv: Function,
}

interface ResponseMembers {
	status: string | number,
	data?: ParticipantData[],
	error?: string,
}

interface ListMembersProps {
	chan: string
}

interface ButtonConvProps {
	chan: ChannelData,
	focusConv: string;
	setFocusConv: Function
}

interface MessagesListenerProps {
	chan: string,
	msg: MessageData,
}

function ButtonConv({chan, focusConv, setFocusConv}: ButtonConvProps) {

	const [newMsg, setNewMsg]: [boolean, Function] = useState(false);
	const user = useContext(UserContext);
	const socket = useContext(SocketChatContext);
	const [senderConv, setSenderConv]: [string, Function] = useState(""); 

	const [res, setRes]: [ResImg, Function] = useState({status: "loading"});
	
	useEffect(() => {
		GetRequest("/chat/getAvatarDm/" + chan.name).then((response) => setRes(response));
		function messageListener(message: MessagesListenerProps) {
			setSenderConv(message.chan)
			if (chan.name === message.chan && focusConv !== message.chan) {
				setNewMsg(true);
			}
		};
		socket!.on('message', messageListener);
		return () => {socket!.off('message', messageListener);};
	}, [socket, newMsg]);

	return (
		<button
			className={`button-conv ${chan.name === focusConv && 'focused'} ${newMsg === true && senderConv !== focusConv && 'notice'}`}
			key={chan.name}
			onClick={() => {setFocusConv(chan.name); setNewMsg(false)}}
			>
				<Avatar src="" alt="avatar"></Avatar>
				<p>{chan.name.replace(user!, "").replace("+", "")}</p>
		</button>
	)
}

function ListConv({focusConv, setFocusConv}: focusConvProps) {

	const socket = useContext(SocketChatContext);
	const [senderConv, setSenderConv]: [string, Function] = useState(""); 
	const [response, setResponse]: [Response, Function] = useState({status: "loading"});
	
	useEffect(() => {
			GetRequest("/chat/getConvs").then((response) => setResponse(response));
			function messageListener(message: MessagesListenerProps) {
				setSenderConv(message.chan)
			};
			socket!.on('message', messageListener);
			return () => {socket!.off('message', messageListener);};
	}, [socket, senderConv]);
	if (response.status === "loading")
		return (<Loading />);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);

	const dms: ChannelData[]  = response.data!.filter((conv) => conv.mode === ChanMode.DM)
	const chans: ChannelData[]  = response.data!.filter((conv) => conv.mode !== ChanMode.DM)
	return (
		<>
			{
				dms.map((chan) => (
					<ButtonConv key={chan.name} chan={chan} focusConv={focusConv} setFocusConv={setFocusConv} />
				))
			}
			{
				chans.map((chan) => (
					<ButtonConv chan={chan} focusConv={focusConv} setFocusConv={setFocusConv} />
				))
			}
		</>
	)
}

function ListMembers({chan}: ListMembersProps) {

	const isDm: boolean = chan.includes("+");

	const [response, setResponse]: [ResponseMembers, Function] = useState({status: "loading"});
	useEffect(() => {
			GetRequest("/chat/getMembers/" + chan).then((response) => setResponse(response));
	}, [chan]);
	if (response.status === "loading")
		return (<Loading />);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);

	if (!response.data)
		return <div>there is only you in this channel</div>
	return (
		<div>
			{
				response.data.map(( member ) => <div key={member.user.login}>{member.user.login}</div>)
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
		<SocketChatContext.Provider value={socket}>
			<div className="chat-page">
				<div className="list-conv">
					<ListConv focusConv={focusConv} setFocusConv={setFocusConv}/>
				</div>
				<div className="chatting">
					{focusConv ? <Chatting chan={focusConv} /> : <ChannelNav />}
				</div>
				<div className="list-member">
					{focusConv ? <ListMembers chan={focusConv} /> : null}
				</div>
			</div>
		</SocketChatContext.Provider>
	);
}
