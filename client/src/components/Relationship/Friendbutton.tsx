import { Alert, CircularProgress, IconButton, Snackbar } from "@mui/material";
import { DeleteRequest, GetRequest } from "../../utils/Request";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useEffect, useState } from "react";
import ErrorHandling from "../../utils/Error";
import Loading from "../../utils/Loading";
import { CancelScheduleSend, PersonRemove } from "@mui/icons-material";

interface FriendButtonProps {
	login: string
}

interface FriendProps {
	login: string,
	update: Function
}

interface RemoveProps {
	login: string,
	type: string,
	update: Function
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

function FriendInvitation ({ login, update }: FriendProps) {
	const [open, setOpen]: [boolean, Function] = useState(false);
	const [response, setResponse]: [Response, Function] = useState({status: "inactive"});
	
	function handleClick() {
		GetRequest("/relationship/invite/" + login).then((response) => {setResponse(response); setOpen(true);});
	}
	if (response.status === "KO")
		return (<ErrorHandling status={response.status} message={response.error} />);
	
	function handleClose() {
		setOpen(false);
		update();
	}

	return (
		<>
			<CircularProgress sx={{position:"absolute", display:open? "unset": "none"}} color="warning" />
			<IconButton onClick={handleClick}>
						<PersonAddIcon />
			</IconButton>
			{
				open &&
					<Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
						<Alert className="w-fit" onClose={handleClose} severity = {response.data?.status === "OK" ? "success" : "error"}>
							{response.data?.description}
						</Alert> 
					</Snackbar>
			}
		</>
	)
}

function RemoveRelation({login, type, update}: RemoveProps) {
	const [open, setOpen]: [boolean, Function] = useState(false);
	const [response, setResponse]: [Response, Function] = useState({status: "inactive"});
	
	function handleClick() {
		DeleteRequest("/relationship/remove" + type + "/" + login).then((response) => {setResponse(response); setOpen(true);});
	}
	if (response.status === "KO")
		return (<ErrorHandling status={response.status} message={response.error} />);

	function handleClose() {
		setOpen(false);
		update();
	}

	return (
		<>
			<CircularProgress sx={{position:"absolute", display:open? "unset": "none"}} color="warning" />
			<IconButton onClick={handleClick}>
					{type === "Friend" ? <PersonRemove /> : <CancelScheduleSend />}
			</IconButton>
			{
				open &&
						<Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
							<Alert className="w-fit" onClose={handleClose} severity = {response.data?.status === "OK" ? "success" : "error"}>
								{response.data?.description}
							</Alert> 
						</Snackbar>
			}
		</>
	)
}

function renderFriendButton(login: string, status: string, update: Function) {
	switch(status) {
		case 'invited':
			return (<RemoveRelation login={login} type="Invitation" update={update}/>);
		case 'accepted':
			return (<RemoveRelation login={login} type="Friend" update={update}/>);
		case 'noRelation':
			return (<FriendInvitation login={login} update={update}/>)
		default:
			return (
				<IconButton disabled>
					<PersonAddIcon />
				</IconButton>
			);
	}
}

export default function Friendbutton ({ login }: FriendButtonProps) {
	const [response, setResponse]: [Response, Function] = useState({status: "loading"});
	const [update, setUpdate]: [number, Function] = useState(0);

	useEffect(() => {
		GetRequest("/relationship/" + login).then((response) => setResponse(response));
	}, [update, login]);
	if (response.status === "loading")
		return (<Loading />);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);

	function handleUpdate() {
		setUpdate(update + 1);
	}

	return (
		<>
			{renderFriendButton(login, response.data!.status, handleUpdate)}
		</>
	)
}
