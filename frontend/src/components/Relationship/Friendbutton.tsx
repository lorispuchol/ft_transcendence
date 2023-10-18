import { IconButton } from "@mui/material";
import { DeleteRequest, GetRequest } from "../../utils/Request";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { ReactNode, useEffect, useState } from "react";
import ErrorHandling from "../../utils/Error";
import { CancelScheduleSend, PersonRemove } from "@mui/icons-material";

interface FriendButtonProps {
	login: string,
	render?: Function
}

interface RelationButtonProps {
	path: string,
	update: Function,
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

export function RelationButtonGet({path, update, icon}: RelationButtonProps) {

	const [response, setResponse]: [Response, Function] = useState({status: "inactive"});
	
	function handleClick() {
		GetRequest("/relationship" + path).then((response) => {setResponse(response); update(response.data?.description)});
	}
	if (response.status === "KO")
		return (<ErrorHandling status={response.status} message={response.error} />);
	
	return (
			<IconButton onClick={handleClick} color="inherit">
						{icon}
			</IconButton>
	)
}

export function RelationButtonDelete({path, update, icon}: RelationButtonProps) {
	const [response, setResponse]: [Response, Function] = useState({status: "inactive"});
	
	function handleClick() {
		DeleteRequest("/relationship" + path).then((response) => {setResponse(response); update(response.data?.description)});
	}
	if (response.status === "KO")
		return (<ErrorHandling status={response.status} message={response.error} />);

	return (
			<IconButton onClick={handleClick} color="inherit">
						{icon}
			</IconButton>
	)
}

function renderFriendButton(login: string, status: string, update: Function) {
	switch(status) {
		case 'invited':
			return (<RelationButtonDelete path={"/removeInvitation/" + login} update={update} icon={<CancelScheduleSend />}/>);
		case 'accepted':
			return (<RelationButtonDelete path={"/removeFriend/" + login} update={update} icon={<PersonRemove />}/>);
		case 'noRelation':
		case 'blocked':
			return (<RelationButtonGet path={"/invite/" + login} update={update} icon={<PersonAddIcon />}/>);
		default:
			return (<IconButton disabled><PersonAddIcon /></IconButton>);
	}
}

export default function Friendbutton ({ login, render }: FriendButtonProps) {
	const [response, setResponse]: [Response, Function] = useState({status: "loading"});
	const [update, setUpdate]: [number, Function] = useState(0);

	useEffect(() => {
		GetRequest("/relationship/user/" + login).then((response) => setResponse(response));
	}, [update, login]);
	if (response.status === "loading")
		return (<IconButton><PersonAddIcon /></IconButton>);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);

	function handleUpdate(message: string) {
		setUpdate(update + 1);
		if(render) {render(message);}
	}

	return (
		<>
			{renderFriendButton(login, response.data!.status, handleUpdate)}
		</>
	)
}
