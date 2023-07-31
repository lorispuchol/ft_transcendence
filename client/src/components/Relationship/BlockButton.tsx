import { useEffect, useState } from "react";
import { GetRequest } from "../../utils/Request";
import ErrorHandling from "../../utils/Error";
import { DoDisturbOff, DoDisturbOn } from "@mui/icons-material";
import { RelationButtonDelete, RelationButtonGet } from "./Friendbutton";
import { IconButton } from "@mui/material";

interface BlockProps {
	login: string,
	render?: Function
}

interface FriendshipData {
	status: string,
	description: string
}

interface Response {
	status: string | number,
	data?: FriendshipData,
	error?: string,
}

export default function BlockButton({ login, render }: BlockProps) {
	const [response, setResponse]: [Response, Function] = useState({status: "loading"});
	const [update, setUpdate]: [number, Function] = useState(0);

	useEffect(() => {
		GetRequest("/relationship/" + login).then((response) => setResponse(response));
	}, [update, login]);
	if (response.status === "loading")
		return (<IconButton><DoDisturbOn /></IconButton>);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);

	function handleUpdate() {
		setUpdate(update + 1);
		if (render) {render();}
	}
	
	if (response.data!.status === "blocked")
		return (<RelationButtonDelete path={"/unblock/" + login} update={handleUpdate} icon={<DoDisturbOff />}/>);
	return (<RelationButtonGet path={"/block/" + login} update={handleUpdate} icon={<DoDisturbOn />}/>);
}
