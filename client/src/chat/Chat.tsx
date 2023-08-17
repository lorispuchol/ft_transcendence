import { useContext, useEffect, useState } from "react";
import Chatting from "./Chatting";
import { GetRequest, server_url } from "../utils/Request";
import Loading from "../utils/Loading";
import ErrorHandling from "../utils/Error";
import { useLocation } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import './chat.css'
import { ChanMode, ChannelData, ParticipantData } from "./interfaceData";
import { SocketChatContext } from "../utils/Context";

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

interface ResponseMembers {
	status: string | number,
	data?: ParticipantData[],
	error?: string,
}

interface ListMembersProps {
	chan: string
}

function ListConv({focusConv, setFocusConv}: focusConvProps) {

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
		<div className="list-conv-flex">
			{
				dms.map((chan) => (
					<button
						className={`button-conv ${chan.name === focusConv ? 'focused' : ''}`}
						key={chan.name}
						onClick={() => setFocusConv(chan.name)}
					>
						{chan.name}
					</button>
				))
			}
			{
				chans.map((chan) => (
					<button
						className={`button-conv ${chan.name === focusConv ? 'focused' : ''}`}
						key={chan.name}
						onClick={() => setFocusConv(chan.name)}
					>
						{chan.name}
					</button>
				))
			}
		</div>
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
					<ListConv focusConv={focusConv} setFocusConv={setFocusConv}/>
					<Chatting chan={focusConv} />
					{focusConv ? <ListMembers chan={focusConv} /> : null}
			</div>
		</SocketChatContext.Provider>
	);
}
