import { IconButton } from "@mui/material";
import { DeleteRequest, GetRequest } from "../../utils/Request";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { ReactNode, useEffect, useState } from "react";
import { CancelScheduleSend, PersonRemove } from "@mui/icons-material";
import { logInfo } from "../../chat/Chat";

interface RelationButtonProps {
	path: string,
	setStatus: Function,
	icon: ReactNode,
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

export function RelationButtonGet({path, setStatus, icon}: RelationButtonProps) {
	
	function handleClick() {
		GetRequest("/relationship" + path).then((response: Response) => {
			if (response.data) {
				logInfo(response.data.description);
				setStatus("reload");
			}
		});
	}
	
	return (
			<IconButton onClick={handleClick} color="inherit">
						{icon}
			</IconButton>
	)
}

export function RelationButtonDelete({path, setStatus, icon}: RelationButtonProps) {
	
	function handleClick() {
		DeleteRequest("/relationship" + path).then((response: Response) => {
			if (response.data) {
				logInfo(response.data.description);
				setStatus("reload");
			}
		});
	}

	return (
			<IconButton onClick={handleClick} color="inherit">
						{icon}
			</IconButton>
	)
}

export default function Friendbutton ({ login}: { login: string}) {
	const [status, setStatus]: [string, Function] = useState("");

	useEffect(() => {
		GetRequest("/relationship/user/" + login).then((response: Response) => {
			if (response.data)
				setStatus(response.data.status);
		});
	}, [status, login]);
	if (!status)
		return (<IconButton><PersonAddIcon /></IconButton>);
	
	switch(status) {
		case 'invited':
			return (<RelationButtonDelete path={"/removeInvitation/" + login} setStatus={setStatus} icon={<CancelScheduleSend />}/>);
		case 'accepted':
			return (<RelationButtonDelete path={"/removeFriend/" + login} setStatus={setStatus} icon={<PersonRemove />}/>);
		case 'noRelation':
		case 'blocked':
			return (<RelationButtonGet path={"/invite/" + login} setStatus={setStatus} icon={<PersonAddIcon />}/>);
		default:
			return (<IconButton disabled><PersonAddIcon /></IconButton>);
	}

}
