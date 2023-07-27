import { Close, Done } from "@mui/icons-material";
import { Button } from "@mui/material";
import { DeleteRequest, GetRequest, PatchRequest } from "../../utils/Request";
import ErrorHandling from "../../utils/Error";
import { useState } from "react";
import Loading from "../../utils/Loading";

interface Event {
	type: string,
	sender: string,
}

interface EventButtonProps {
	event: Event
}

interface ButtonProps {
	login: string
}

interface Response {
	status: string | number,
	data?: any,
	error?: string,
}

function RefuseFriend({ login }: ButtonProps) {
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

function AcceptFriend({ login }: ButtonProps) {
	const [response, setResponse]: [Response, Function] = useState({status: "inactive"});

	function handleClick() {
		PatchRequest("/relationship/accept/" + login, {}).then((response) => {setResponse(response)});
	}
	if (response.status == "KO")
			return (<ErrorHandling status={response.status} message={response.error} />);
	if (response.data?.status === "KO")
		return (<strong>{response.data.description}</strong>);

	return (
		<Button onClick={handleClick} color="success"><Done/></Button>
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
	if (event.type === "privateMessage")
		return null;
	return (<strong>need fix</strong>)
}
