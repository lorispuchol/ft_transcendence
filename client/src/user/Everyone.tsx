import { useContext, useEffect, useState } from "react";
import { GetRequest } from "../utils/Request";
import Loading from "../utils/Loading";
import ErrorHandling from "../utils/Error";
import EventList from "../components/event/EventList";
import FriendInvitation from "../components/Relationship/FriendInvitation";
import { EventContext, UserContext } from "../utils/Context";
import { Avatar, List, ListItem, Paper } from "@mui/material";
import { defaultAvatar } from "./Profile";
import { Socket } from "socket.io-client";
import { Circle, CircleOutlined, CircleTwoTone } from "@mui/icons-material";

interface ProfileElementProps {
	user: UserData,
}

interface UserData {
	status: string,
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

interface Status {
	login: string,
	status: string,
}

function renderStatus(status: string) {
	switch(status) {
		case 'online':
			return (<Circle sx={{color:"green"}} />);
		case 'blocked':
			return (<Circle sx={{color:"error"}} />);
		case 'offline':
			return (<Circle sx={{color:"red"}} />)
		default:
			return (<strong>error status:{status}</strong>)
	}
}

function ProfileElement({ user }: ProfileElementProps) {
	const avatar: any = user.avatar ? user.avatar : defaultAvatar;
	
	return (
		<Paper key={user.id} sx={{marginBottom: 2, display: "flex", alignItems: "center", height: 50}}>
			{renderStatus(user.status)}
			<Avatar src={avatar} alt={user.username}/>
			<div className="ml-4">{user.username}</div>
			<div><FriendInvitation login={user.login}/></div>
		</Paper>
	)
}



export default function Everyone()
{
	
	const username: string = useContext(UserContext)!;
	const socket: Socket = useContext(EventContext)!;
	const [status, setStatus]: [Map<string,string>, Function] = useState(new Map());
	const [response, setResponse]: [Response, Function] = useState({status: "loading"});

	useEffect(() => {
		function statusListener(status: Status) {
			setStatus((prevStatus: Map<string, string>) => {
				prevStatus.set(status.login, status.status);
				return (new Map(prevStatus));
			})
		}

		socket.on('status', statusListener);
		socket.emit('getStatus');
	}, [socket]);

	useEffect(() => {
			GetRequest("/user/all").then((response) => setResponse(response));
	}, []);
	if (response.status === "loading")
		return (<Loading />);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);

	
	const users: UserData[] = response.data!;
	users.forEach((element: UserData) => {
		const userStatus: string | undefined = status.get(element.login);
		element.status = userStatus ? userStatus : "offline";
	});
	return (
		<>
			<List sx={{
		  			overflow: 'auto',
		  			maxHeight: 1000,
				}}>
				{users?.map((user: UserData) => (
					<div className="px-4">
						<ProfileElement user={user} />
					</div>
				))}
			</List>
		</>
	);
}
