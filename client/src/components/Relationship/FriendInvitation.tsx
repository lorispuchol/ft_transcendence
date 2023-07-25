import { Alert, Button, IconButton } from "@mui/material";
import { GetRequest, server_url } from "../../utils/Request";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useEffect, useState } from "react";

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

export default function FriendInvitation ({login}: FriendInvitationProps) {
	const [open, setOpen]: [boolean, Function] = useState(false);
	const [response, setResponse]: [Response, Function] = useState({status: "loading"});

	return (
		<>
			<IconButton onClick={() => {
					GetRequest("/relationship/invite/" + login).then((response) => {setResponse(response); setOpen(true);});
				}}>
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