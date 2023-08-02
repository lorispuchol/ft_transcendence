import { useContext, useEffect, useState } from "react";
import { EventContext } from "../utils/Context";
import { GetRequest } from "../utils/Request";
import { Avatar, List, Paper } from "@mui/material";
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
	avatar: string,
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
	
	//useEffect(() => {}, [render])
	
	function rerender() {
		setRender(render + 1);
	}

	return (
		<Paper key={render} sx={{
			marginBottom: 2,
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			height: 50,
		}}>
			<div className="px-2"><UserStatus login={user.login} /></div>
			<Avatar src={avatar} alt={user.username}/>
			<NavLink to={'/profile/' + user.login}>
				<Paper className="everyone_username">{user.username}</Paper>
			</NavLink>
			<GamingButton login={user.login}/>
      		<div><MessageButton receiver={user.login}/></div>
			<div className="grid grid-cols-2">
				<div><Friendbutton login={user.login} render={rerender} /></div>
				<div><BlockButton login={user.login} render={rerender} /></div>
			</div>
		</Paper>
	)
}



export default function Everyone() {
	const [response, setResponse]: [Response, Function] = useState({status: "loading"});
	const [users, setUsers]: [UserData[], Function] = useState([]);
	const socket = useContext(EventContext);

	useEffect(() => {
			GetRequest("/user/all").then((response) => {
				setResponse(response);
				if (response.data)
					setUsers(response.data);
			});

			function everyoneListener(newUser: UserData) {
				console.log(newUser);
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
				{users!.map((user: UserData) => (
					<div key={user.id} className="px-4">
						<ProfileElement user={user} />
					</div>
				))}
			</List>
	);
}
