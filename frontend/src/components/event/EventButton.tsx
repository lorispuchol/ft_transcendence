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
	senderId: number,
	gameMode?: string,
}

interface EventButtonProps {
	event: Event
}

interface FriendProps {
	login: string
}

interface GameProps {
	senderId: number,
	mode?: string
}

interface Response {
	status: string | number,
	data?: any,
	error?: string,
}

function RefuseFriend({ login }: FriendProps) {
	const [response, setResponse]: [Response, Function] = useState({status: "inactive"});

	function handleClick() {
		DeleteRequest("/relationship/refuse/" + login).then((response) => {setResponse(response)});
	}
	if (response.status === "KO")
		return (<ErrorHandling status={response.status} message={response.error} />);
	if (response.data?.status === "KO")
		return (<strong>{response.data.description}</strong>);

	return (
		<Button onClick={handleClick} color="error"><Close/></Button>
	)
}

function AcceptFriend({ login }: FriendProps) {
	const [response, setResponse]: [Response, Function] = useState({status: "inactive"});

	function handleClick() {
		PatchRequest("/relationship/accept/" + login, {}).then((response) => {setResponse(response)});
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

function RefuseGame({ senderId }: GameProps) {
	const socket = useContext(EventContext)!;

	function handleClick() {
		socket.emit("refuseGame", senderId);
	}

	return (
		<Button onClick={handleClick} color="error"><Close/></Button>
	)
}

export default function EventButton ({ event }: EventButtonProps) {

	if (event.type === "friendRequest")
		return (
			<div className="grid grid-cols-2">
				<AcceptFriend login={event.sender} />
				<RefuseFriend login={event.sender} />
			</div>
		)
	if (event.type === "gameRequest")
		return (
			<div className="grid grid-cols-2">
				<AcceptGame senderId={event.senderId} mode={event.gameMode}/>
				<RefuseGame senderId={event.senderId} />
			</div>
		)
	if (event.type !== "message")
		return (<strong>need fix</strong>)
	return null
}
