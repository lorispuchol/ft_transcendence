import { Alert, Button, IconButton, Snackbar } from "@mui/material";
import { GetRequest, server_url } from "../../utils/Request";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useEffect, useState } from "react";
import ErrorHandling from "../../utils/Error";
import Loading from "../../utils/Loading";

interface FriendInvitationProps {
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

export default function FriendInvitation ({ login }: FriendInvitationProps) {
	const [open, setOpen]: [boolean, Function] = useState(false);
	const [response, setResponse]: [Response, Function] = useState({status: "inactive"});

	function handleClick() {
		GetRequest("/relationship/invite/" + login).then((response) => {setResponse(response); setOpen(true);});
	}
	if (response.status !== "inactive")
	{
		if (response.status === "loading")
			return (<Loading />);
		if (response.status !== "OK")
			return (<ErrorHandling status={response.status} message={response.error} />);
	}

	return (
		<>
			<IconButton onClick={handleClick}>
				<PersonAddIcon />
			</IconButton>
			{
				open
					?	<Alert className="w-2/6" onClose={() => {setOpen(false)}} severity = {response.data?.status === "OK" ? "success" : "error"}>
							{response.data?.description}
						</Alert> 
					: null
			}
		</>
	)
}