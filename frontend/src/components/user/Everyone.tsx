import { useContext, useEffect, useState } from "react";
import { EventContext } from "../../utils/Context";
import { GetRequest } from "../../utils/Request";
import { Avatar, List, Paper } from "@mui/material";
import { defaultAvatar } from "../../pages/Profile/Profile";
import { NavLink } from "react-router-dom";
import Friendbutton from "../Relationship/Friendbutton";
import UserStatus from "./UserStatus";
import ErrorHandling from "../../utils/Error";
import GamingButton from "../game/GamingButton";
import BlockButton from "../Relationship/BlockButton";
import MessageButton from "../../chat/MessageButton";
import './user.scss'
import { ToastContainer } from "react-toastify";
import Loader from "../Loading/Loader";

interface UserData {
	id: number,
	avatar: string,
	login: string,
	username: string,
}

interface Response {
	status: string,
	data?: UserData[],
	error?: string,
}


function ProfileElement({ userId }: {userId: number}) {
	const [user, setUser]: [UserData | null, Function] = useState<UserData | null>(null);

	useEffect(() => {
		GetRequest("/user/profile/id/" + userId).then((response) => {
			if (response.data)
				setUser(response.data);
		});
	}, [userId]);
	if (!user)
		return (<Loader />);

	return (
		<Paper className="profile_element">
			<div className="status"><UserStatus userId={user.id} /></div>
			<div className="py-2"><Avatar src={user.avatar?user.avatar:defaultAvatar} alt={user.username}/></div>
			<div className="px-4">
				<NavLink to={'/profile/' + user.username}>
					<Paper className="everyone_username">{user.username}</Paper>
				</NavLink>
			</div>
			<div className="button_group">
				<div className="gaming_button"><GamingButton id={user.id}/></div>
      			<div className="message_button"><MessageButton receiverId={user.id}/></div>
				<div className="friend_button"><Friendbutton id={user.id} /></div>
				<div className="block_button"><BlockButton id={user.id} /></div>
			</div>
		</Paper>
	)
}

export default function Everyone() {
	const [response, setResponse]: [Response, Function] = useState({status: "loading"});
	const [users, setUsers]: [number[], Function] = useState([]);
	const socket = useContext(EventContext)!;

	useEffect(() => {
		GetRequest("/user/all").then((response) => {
			setResponse(response);
			if (response.data)
				setUsers(response.data);
		});
	
		function everyoneListener(newUser: number) {
			setUsers((prev: number[]) =>  {	
				if (prev.indexOf(newUser) === -1)
					return ([...prev, newUser]);
				return [...prev];
			});
		}
		socket.on('everyone', everyoneListener);
		
		return () => {socket.off('everyone', everyoneListener)};
	}, [socket]);
	if (response.status === "loading")
		return (<Loader />);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);

	return (
			<List className="everyone_list">
				{users?.length ?
					users.map((userId: number) => (
						<ProfileElement key={userId} userId={userId} />
					))
					:
					<Paper className="nobody">nobody there</Paper>
				}
				<ToastContainer />
			</List>
	);
}
