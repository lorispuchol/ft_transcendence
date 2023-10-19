import { useEffect, useState } from "react";
import { GetRequest } from "../../utils/Request";
import { DoDisturbOff, DoDisturbOn } from "@mui/icons-material";
import { RelationButtonDelete, RelationButtonGet } from "./Friendbutton";
import { IconButton } from "@mui/material";

interface BlockProps {
	login: string,
	updateUser?: Function
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

export default function BlockButton({ login, updateUser }: BlockProps) {
	const [status, setStatus]: [string, Function] = useState("");

	useEffect(() => {
		GetRequest("/relationship/user/" + login).then((response: Response) => {
			if (response.data)
				setStatus(response.data.status);
		});
	}, [status, login]);
	
	if (!status)
		return (<IconButton><DoDisturbOn /></IconButton>);

	const update = updateUser ? updateUser : setStatus;
	
	if (status === "blocked")
		return (<RelationButtonDelete path={"/unblock/" + login} setStatus={update} icon={<DoDisturbOff />}/>);
	return (<RelationButtonGet path={"/block/" + login} setStatus={update} icon={<DoDisturbOn />}/>);
}
