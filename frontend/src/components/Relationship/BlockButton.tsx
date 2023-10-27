import { useEffect, useState } from "react";
import { GetRequest } from "../../utils/Request";
import { DoDisturbOff, DoDisturbOn } from "@mui/icons-material";
import { RelationButtonDelete, RelationButtonGet } from "./Friendbutton";
import { IconButton } from "@mui/material";

interface FriendshipData {
	status: string,
	description: string
}

interface Response {
	status: string | number,
	data?: FriendshipData,
	error?: string,
}

export default function BlockButton({ id }: {id: number}) {
	const [status, setStatus]: [string, Function] = useState("");

	useEffect(() => {
		GetRequest("/relationship/user/" + id).then((response: Response) => {
			if (response.data)
				setStatus(response.data!.status);
		});
	}, [status, id]);
	
	if (!status)
		return (<IconButton><DoDisturbOn /></IconButton>);
	
	if (status === "blocked")
		return (<RelationButtonDelete path={"/unblock/" + id} setStatus={setStatus} icon={<DoDisturbOff />}/>);
	return (<RelationButtonGet path={"/block/" + id} setStatus={setStatus} icon={<DoDisturbOn />}/>);
}
