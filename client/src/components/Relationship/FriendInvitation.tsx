import { Button, IconButton } from "@mui/material";
import { GetRequest, server_url } from "../../utils/Request";
import PersonAddIcon from '@mui/icons-material/PersonAdd';

interface FriendInvitationProps {
	login: string
}

export default function FriendInvitation ({login}: FriendInvitationProps) {
	


	return (
		<IconButton
			onClick={() => {
				GetRequest(server_url + "relationship/invite/" + login)
			}}
		>
			<PersonAddIcon />
		</IconButton>
	)  
}