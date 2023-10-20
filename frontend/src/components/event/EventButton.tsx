import { Close, Done } from "@mui/icons-material";
import { Button } from "@mui/material";
import { DeleteRequest, PatchRequest } from "../../utils/Request";
import ErrorHandling from "../../utils/Error";
import { useContext, useState } from "react";
import { EventContext } from "../../utils/Context";
import { useNavigate } from "react-router-dom";


interface Event {
	type: string,
	sender: string,
	senderId: number | string,
	gameMode?: string,
}

interface EventButtonProps {
	event: Event
}

interface ButtonChannelProps {
	channel: string
}
interface FriendProps {
	id:  string | number
}

interface GameProps {
	senderId: number | string,
	mode?: string
}

interface Response {
	status: string | number,
	data?: any,
	error?: string,
}

function RefuseChannel({ channel }: ButtonChannelProps) {
	const [response, setResponse]: [Response, Function] = useState({status: "inactive"});

	function handleClick() {
		DeleteRequest("/chat/refuseChannel/" + channel).then((response) => {setResponse(response)});
	}
	if (response.status === "KO")
		return (<ErrorHandling status={response.status} message={response.error} />);
	if (response.data?.status === "KO")
		return (<strong>{response.data.description}</strong>);

	return (
		<Button onClick={handleClick} color="error"><Close/></Button>
	)
}

function AcceptChannel({ channel }: ButtonChannelProps) {

	const [response, setResponse]: [Response, Function] = useState({status: "inactive"});
	const navigate = useNavigate()

	function handleClick() {
		PatchRequest("/chat/acceptChannel/" + channel, {}).then((response) => {
			setResponse(response)
			if (response.status === "OK")
				navigate("/chat", {replace: true, state: {to: channel}})
		});
	}
	if (response.status === "KO")
		return (<ErrorHandling status={response.status} message={response.error} />);
	if (response.data?.status === "KO")
		return (<strong>{response.data.description}</strong>);

	return (
		<Button onClick={handleClick} color="success"><Done/></Button>
	)
}

function RefuseFriend({ id }: FriendProps) {
	const [response, setResponse]: [Response, Function] = useState({status: "inactive"});

	function handleClick() {
		DeleteRequest("/relationship/refuse/" + id).then((response) => {setResponse(response)});
	}
	if (response.status === "KO")
		return (<ErrorHandling status={response.status} message={response.error} />);
	if (response.data?.status === "KO")
		return (<strong>{response.data.description}</strong>);

	return (
		<Button onClick={handleClick} color="error"><Close/></Button>
	)
}

function AcceptFriend({ id }: FriendProps) {
	const [response, setResponse]: [Response, Function] = useState({status: "inactive"});

	function handleClick() {
		PatchRequest("/relationship/accept/" + id, {}).then((response) => {setResponse(response)});
	}
	if (response.status === "KO")
			return (<ErrorHandling status={response.status} message={response.error} />);
	if (response.data?.status === "KO")
		return (<strong>{response.data.description}</strong>);

	return (
		<Button onClick={handleClick} color="success"><Done/></Button>
	)
}

function AcceptGame({ senderId, mode }: GameProps) {
	const socket = useContext(EventContext)!;
	const navigate = useNavigate();

	function handleClick() {
		socket.emit("acceptGame", {senderId, mode});
		navigate("/game");
	}

	return (
		<Button onClick={handleClick} color="success"><Done/></Button>
	)
}

function RefuseGame({ senderId, mode }: GameProps) {
	const socket = useContext(EventContext)!;

	function handleClick() {
		socket.emit("refuseGame", {senderId, mode});
	}

	return (
		<Button onClick={handleClick} color="error"><Close/></Button>
	)
}

export default function EventButton ({ event }: EventButtonProps) {

	if (event.type === "friendRequest")
		return (
			<div className="grid grid-cols-2">
				<AcceptFriend id={event.senderId} />
				<RefuseFriend id={event.senderId} />
			
			</div>
		)
	if (event.type === "channelInvitation")
		return (
			<div className="grid grid-cols-2">
				<AcceptChannel channel={event.sender} />
				<RefuseChannel channel={event.sender} />
			</div>
		)
	if (event.type === "gameRequest")
		return (
			<div className="grid grid-cols-2">
				<AcceptGame senderId={event.senderId} mode={event.gameMode}/>
				<RefuseGame senderId={event.senderId} mode={event.gameMode}/>
			</div>
		)
	if (event.type !== "message")
		return (<strong>need fix</strong>)
	return null
}
