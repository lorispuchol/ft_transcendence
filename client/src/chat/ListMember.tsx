import { useEffect, useState } from "react";
import { GetRequest } from "../utils/Request";
import ErrorHandling from "../utils/Error";
import Loading from "../utils/Loading";
import { ParticipantData, UserData } from "./interfaceData";
import { defaultAvatar } from "../pages/Profile/Profile";
import { Alert, Avatar, Paper, Snackbar } from "@mui/material";
import UserStatus from "../user/UserStatus";
import { NavLink } from "react-router-dom";
import GamingButton from "../components/game/GamingButton";
import MessageButton from "./MessageButton";
import Friendbutton from "../components/Relationship/Friendbutton";
import BlockButton from "../components/Relationship/BlockButton";
import { ToastContainer } from "react-toastify";
import { logSuccess } from "./Chat";

interface ProfileModuleProps {
	user: UserData,
}
interface ResponseMembers {
	status: string | number,
	data?: ParticipantData[],
	error?: string,
}

interface ListMembersProps {
	chan: string
}

function ProfileModule({ user }: ProfileModuleProps) {
	const avatar: any = user.avatar ? user.avatar : defaultAvatar;
	const [render, setRender]: [number, Function] = useState(0);
	const [message, setMessage]: [string, Function] = useState("");
	const [open, setOpen]: [boolean, Function] = useState(false);

	function handleClose() {
		setOpen(false);
	}

	function rerender(message: string) {
		setRender(render + 1);
		setMessage(message);
		setOpen(true);
	}

	return (
		<>
		<Paper key={render} className="profile_element">
			<div className="status"><UserStatus login={user.login} /></div>
			<div className="py-2"><Avatar src={avatar} alt={user.username}/></div>
			<div className="px-4"> 
				<NavLink to={'/profile/' + user.login}>
					<Paper className="everyone_username">{user.username}</Paper>
				</NavLink>
			</div>
			<div className="button_group">
				<div className="gaming_button"><GamingButton login={user.login}/></div>
      			<div className="message_button"><MessageButton receiver={user.login}/></div>
				<div className="friend_button"><Friendbutton login={user.login} render={rerender} /></div>
				<div className="block_button"><BlockButton login={user.login} render={rerender} /></div>
			</div>
			<button className="btn btn-primary" onClick={() => logSuccess("rien")}>log</button>
		</Paper>
		<Snackbar open={open?true:false} autoHideDuration={1000} onClose={handleClose}>
			<Alert className="w-fit" onClose={handleClose} severity="info">{message}</Alert>
		</Snackbar>
		</>
	)
}

export default function ListMembers({chan}: ListMembersProps) {

	//const isDm: boolean = chan.includes("+");

	const [response, setResponse]: [ResponseMembers, Function] = useState({status: "loading"});
	useEffect(() => {
			GetRequest("/chat/getMembers/" + chan).then((response) => setResponse(response));
	}, [chan]);
	if (response.status === "loading")
		return (<Loading />);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);

	if (!response.data)
		return null	
	if (!response.data[0])
		return <div>there is only you in this channel</div>
	return (
		<>
		<div>
			{
				response.data.map(( member ) => 
					<div className="my-3" key={member.user.login}>
						<ProfileModule user={member.user}/>
					</div>
				)
			}
		</div>
		<ToastContainer />
		</>
	)
	
}