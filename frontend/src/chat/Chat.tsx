import { useContext, useEffect, useState } from "react";
import Chatting from "./Chatting";
import { GetRequest, server_url } from "../utils/Request";
import Loading from "../utils/Loading";
import ErrorHandling from "../utils/Error";
import { useLocation, useNavigate } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import './chat.scss'
import { ChanMode, ChannelData, MemberDistinc, MessageData, ParticipantData, UserData } from "./interfaceData";
import { DisplayMemberContext, SetDisplayMemberContext, SetSettingsContext, SocketChatContext, UserContext } from "../utils/Context";
import ChannelNav from "./ChannelNav";
import { Avatar } from "@mui/material";
import { Tag } from "@mui/icons-material";
import ListMembers from "./ListMember";
import { defaultAvatar } from "../pages/Profile/Profile";
import { ToastContainer, toast } from "react-toastify";

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

export function logWarn(warn: string) {
	toast.warn(warn, {
		position: "bottom-left",
		autoClose: 2000,
		hideProgressBar: true,
	});
}

export function logError(error: string[]) {
	toast.error(error[0], {
		position: "bottom-left",
		autoClose: 2000,
		hideProgressBar: true,
	});
}


export function logSuccess(msg: string) {
	toast.success(msg, {
		position: "bottom-left",
		autoClose: 2000,
		hideProgressBar: true,
	});
}

export function logInfo(msg: string) {
	toast.info(msg, {
		position: "bottom-left",
		autoClose: 2000,
		hideProgressBar: true,
	});
}

function ChanButtonConv({chan, focusConv, setFocusConv}: ButtonConvProps) {

	const [resMembers, setResMembers]: [ResMembers, Function] = useState({status: "loading"});
	const user = useContext(UserContext);
	const setSettingsContext = useContext(SetSettingsContext);
	const setDisplayMemberContext = useContext(SetDisplayMemberContext);

	useEffect(() => {
		GetRequest("/chat/getMembers/" + chan.name).then((res) => setResMembers(res))
	}, [chan]);

	if (resMembers.status === "loading")
		return (<Loading />);
	if (resMembers.status !== "OK")
		return (<ErrorHandling status={resMembers.status} message={resMembers.error} />);
	if (!resMembers.data)
		return null;
	if (resMembers.data!.find((member) => member.user.username === user)
		&& resMembers.data!.find((member) => member.user.username === user)!.distinction <= MemberDistinc.INVITED)
		return null;
	
	function handleOnClick() {
		setFocusConv(chan.name);
		setDisplayMemberContext(null)
		setSettingsContext(false);
	}

	return (
		<button
			className={`button-conv ${chan.name === focusConv && 'focused'}`}
			key={chan.name}
			onClick={handleOnClick}
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
	const setDisplayMemberContext = useContext(SetDisplayMemberContext);
	const setSettingsContext = useContext(SetSettingsContext);
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
		displayAvatar = resMembers.data![1].user.avatar
	}
	else {
		displayUsername = resMembers.data![0].user.username
		displayAvatar = resMembers.data![0].user.avatar
	}
	if (!displayAvatar)
		displayAvatar = defaultAvatar;

	function handleOnClick() {
		setFocusConv(chan.name);
		setDisplayMemberContext(null);
		setSettingsContext(false);
	}

	return (
		<button
			className={`button-conv ${chan.name === focusConv && 'focused'}`}
			key={chan.name}
			onClick={handleOnClick}
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
	const navigate = useNavigate();
	
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

	if (!response.data)
		return null;

	const dms: ChannelData[]  = response.data!.filter((conv) => conv.mode === ChanMode.DM)
	const chans: ChannelData[]  = response.data!.filter((conv) => conv.mode !== ChanMode.DM)
	return (
		<>
			{
				dms.map((chan) => (
					<DmButtonConv key={chan.name} chan={chan} focusConv={focusConv} setFocusConv={setFocusConv} />
				))
			}
			{dms.length && chans.length ? <hr /> : null}
			{
				chans.map((chan) => (
					<ChanButtonConv key={chan.name} chan={chan} focusConv={focusConv} setFocusConv={setFocusConv} />
				))
			}
			<button onClick={() => {navigate("/chat", {state: {to: ""}})}} className="my-5 w-full h-14 btn text-slate-200 bg-purple-900 btn-neutral hover:bg-purple-700">
					MENU
			</button>
		</>
	)
}

export default function Chat() {
	const location = useLocation();

	const [focusConv, setFocusConv]: [string, Function] = useState(location.state?.to);
	const [displayProfile, setDisplayProfile]: [UserData | null, Function] = useState(null);
	const [settings, setSettings]: [boolean, Function] = useState(false);

	const [socket, setSocket]: [Socket | null, Function] = useState(null);

	useEffect(() => {
		const token = localStorage.getItem("token");
		const option = { transportOptions: { polling: { extraHeaders: { token: token }}}};
		const newSocket = io(server_url + "/chat", option);
		setSocket(newSocket);
		return () => {newSocket.close()};
	}, [setSocket, focusConv]);

	useEffect(() => {
		setFocusConv(location.state?.to);
	}, [location]);

	if (!socket)
		return (<Loading />)

	return (
		<SocketChatContext.Provider value={socket}>
		<SetDisplayMemberContext.Provider value={setDisplayProfile}>
		<DisplayMemberContext.Provider value={displayProfile}>
		<SetSettingsContext.Provider value={setSettings}>
			<div className="chat-page">
				<div className="list-conv">
					<ListConv focusConv={focusConv} setFocusConv={setFocusConv}/>
				</div>
				<div className="chatting">
					{focusConv ? <Chatting chan={focusConv} /> : <ChannelNav />}
				</div>
				<div className="list-member">
					{focusConv ? <ListMembers chan={focusConv} settings={settings} setSettings={setSettings} /> : null}
				</div>
			</div>
			<ToastContainer />
		</SetSettingsContext.Provider>
		</DisplayMemberContext.Provider>
		</SetDisplayMemberContext.Provider>
		</SocketChatContext.Provider>
	);
}
