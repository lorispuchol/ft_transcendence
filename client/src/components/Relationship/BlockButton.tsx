import { useEffect, useState } from "react";
import { GetRequest } from "../../utils/Request";
import Loader from "../Loading/Loader";
import ErrorHandling from "../../utils/Error";
import { Alert, CircularProgress, IconButton, Snackbar } from "@mui/material";
import { Block, DoDisturbOff, DoDisturbOn } from "@mui/icons-material";
import { primaryColor } from "../../fonts/color";
import { RelationButtonDelete, RelationButtonGet } from "./Friendbutton";

interface LoginProps {
	login: string
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

export default function BlockButton({ login }: LoginProps) {
	const [response, setResponse]: [Response, Function] = useState({status: "loading"});
	const [update, setUpdate]: [number, Function] = useState(0);

	useEffect(() => {
		GetRequest("/relationship/" + login).then((response) => setResponse(response));
	}, [update, login]);
	if (response.status === "loading")
		return (<Loader />);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);

	function handleUpdate() {
		setUpdate(update + 1);
	}
	
	if (response.data!.status === "blocked")
		return (<RelationButtonDelete path={"/unblock/" + login} update={handleUpdate} icon={<DoDisturbOff />}/>);
	return (<RelationButtonGet path={"/block/" + login} update={handleUpdate} icon={<DoDisturbOn />}/>);
}
