import { useContext, useEffect, useState } from "react";
import Chatting from "./Chatting";
import { GetRequest, server_url } from "../utils/Request";
import Loading from "../utils/Loading";
import ErrorHandling from "../utils/Error";
import { useLocation } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import './chat.css'
import { ChanMode, ChannelData, MessageData, ParticipantData, UserData } from "./interfaceData";
import { SocketChatContext, UserContext } from "../utils/Context";
import ChannelNav from "./ChannelNav";
import { Avatar } from "@mui/material";
import { MarkEmailUnread, Tag } from "@mui/icons-material";
import ListMembers from "./ListMember";

interface Response {
	status: string | number,
	data?: ChannelData[],
	error?: string,
}

interface ResMembers {
	status: string | number,
	data?: ParticipantData[] | null,
	error?: string,
}
interface focusConvProps {
	chanName?: string;
	chans?: ChannelData[]
	focusConv: string,
	setFocusConv: Function,
}

interface ButtonConvProps {
	chan: ChannelData,
	focusConv: string,
	setFocusConv: Function,
}

interface MessagesListenerProps {
	chan: string,
	msg: MessageData,
}


function ChanButtonConv({chan, focusConv, setFocusConv}: ButtonConvProps) {

	return (
		<button
			className={`button-conv ${chan.name === focusConv && 'focused'}`}
			key={chan.name}
			onClick={()=> setFocusConv(chan.name)}
		>
			<Avatar>
				<Tag />
			</Avatar>
			<p>{chan.name}</p>
		</button>
	)
}


function DmButtonConv({chan, focusConv, setFocusConv}: ButtonConvProps) {

	const user = useContext(UserContext);
	const [resMembers, setResMembers]: [ResMembers, Function] = useState({status: "loading"});

	useEffect(() => {
		GetRequest("/chat/getMembers/" + chan.name).then((res) => setResMembers(res))
	}, [chan]);

	if (resMembers.status === "loading")
		return (<Loading />);
	if (resMembers.status !== "OK")
		return (<ErrorHandling status={resMembers.status} message={resMembers.error} />);

	let displayUsername: string = "";
	let displayAvatar: string = "";
	if (resMembers.data![0].user.username === user) {
		displayUsername = resMembers.data![1].user.username
		// displayAvatar = resMembers.data![1].user.avatar
	}
	else {
		displayUsername = resMembers.data![0].user.username
		// displayAvatar = resMembers.data![0].user.avatar
	}

	return (
		<button
			className={`button-conv ${chan.name === focusConv && 'focused'}`}
			key={chan.name}
			onClick={()=> setFocusConv(chan.name)}
		>
			<Avatar src={displayAvatar} alt="avatar"></Avatar>
			<p>{displayUsername}</p>
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
					<DmButtonConv key={chan.name} chan={chan} focusConv={focusConv} setFocusConv={setFocusConv} />
				))
			}
			{
				dms.length ? 
					chans.length ?
						<hr />
						: null
					:null
			}
			{
				chans.map((chan) => (
					<ChanButtonConv key={chan.name} chan={chan} focusConv={focusConv} setFocusConv={setFocusConv} />
				))
			}
		</>
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

	useEffect(() => {
		setFocusConv(location.state?.to);
	}, [location]);

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
