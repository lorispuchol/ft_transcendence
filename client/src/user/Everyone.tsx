import { useContext, useEffect, useState } from "react";
import { EventContext, UserContext } from "../utils/Context";
import { GetRequest } from "../utils/Request";
import { Alert, Avatar, List, Paper, Snackbar } from "@mui/material";
import { defaultAvatar } from "../pages/Profile/Profile";
import { NavLink } from "react-router-dom";
import Friendbutton from "../components/Relationship/Friendbutton";
import UserStatus from "./UserStatus";
import Loading from "../utils/Loading";
import ErrorHandling from "../utils/Error";
import GamingButton from "../components/game/GamingButton";
import BlockButton from "../components/Relationship/BlockButton";
import MessageButton from "../chat/MessageButton";
import './user.scss'

interface ProfileElementProps {
	user: UserData,
}

interface UserData {
	id: number,
	avatar: string | null,
	login: string,
	username: string,
	nb_victory: number,
	nb_defeat: number,
}

interface Response {
	status: string,
	data?: UserData[],
	error?: string,
}


function ProfileElement({ user }: ProfileElementProps) {
	const avatar: any = user.avatar ? user.avatar : defaultAvatar;
	const [render, setRender]: [number, Function] = useState(0);
	const [open, setOpen]: [string | null, Function] = useState(null);

	function handleClose() {
		setOpen(null);
	}

	function rerender(message: string) {
		setRender(render + 1);
		setOpen(message);
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
			<div className="p-2 grid grid-cols-5">
				<div className="gaming_button"><GamingButton login={user.login}/></div>
      			<div className="message_button"><MessageButton receiver={user.login}/></div>
				<div className="friend_button"><Friendbutton login={user.login} render={rerender} /></div>
				<div className="block_button"><BlockButton login={user.login} render={rerender} /></div>
			</div>
		</Paper>
		<Snackbar open={open?true:false} autoHideDuration={1000} onClose={handleClose}>
			<Alert className="w-fit" onClose={handleClose} severity="info">{open}</Alert> 
		</Snackbar>
		</>
	)
}



export default function Everyone() {
	const [response, setResponse]: [Response, Function] = useState({status: "loading"});
	const [users, setUsers]: [UserData[], Function] = useState([]);
	const socket = useContext(EventContext);
	const username = useContext(UserContext);

	useEffect(() => {
			GetRequest("/user/all").then((response) => {
				setResponse(response);
				if (response.data)
					setUsers(response.data);
			});

			function everyoneListener(newUser: UserData) {
				setUsers((prev: UserData[]) => {
						if (!prev.some((user: UserData) => (user.login === newUser.login)))
							return [...prev, newUser];
						return ([...prev]);
					});
			}

			socket!.on('everyone', everyoneListener);
	}, [socket]);
	if (response.status === "loading")
		return (<Loading />);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);

	return (
			<List className="everyone_list">
				{users.length > 1 ? 
					users.map((user: UserData) => (
						username !== user.username &&
							<div key={user.id} className="">
									<ProfileElement user={user} />
							</div>
					))
					:
					<Paper className="nobody">nobody there</Paper>
				}
			</List>
	);
}
