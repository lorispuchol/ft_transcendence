import { useContext, useEffect, useState } from "react";
import { GetRequest } from "../utils/Request";
import Loading from "../utils/Loading";
import ErrorHandling from "../utils/Error";
import FriendInvitation from "../components/Relationship/FriendInvitation";
import { EventContext, UserContext } from "../utils/Context";
import { Avatar, List, Paper } from "@mui/material";
import { defaultAvatar } from "./Profile";
import { Socket } from "socket.io-client";
import { Circle } from "@mui/icons-material";

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
			return (<Circle sx={{color:"orange"}} />);
		case 'offline':
			return (<Circle sx={{color:"red"}} />)
		default:
			return (<strong>error status:{status}</strong>)
	}
}

function ProfileElement({ user }: ProfileElementProps) {
	const avatar: any = user.avatar ? user.avatar : defaultAvatar;

	
	return (
		<Paper sx={{
			marginBottom: 2,
			display: "flex",
			alignItems: "center",
			justifyContent: 'space-evenly',
			height: 50
		}}>
			{renderStatus(user.status)}
			<Avatar src={avatar} alt={user.username}/>
			<Paper sx={{bgcolor: "#fad390"}}>{user.username}</Paper>
			<div><FriendInvitation login={user.login}/></div>
		</Paper>
	)
}



export default function Everyone()
{
	
	const username: string = useContext(UserContext)!;
	const socket: Socket = useContext(EventContext)!;
	const [userStatus, setUserStatus]: [Map<string,string>, Function] = useState(new Map());
	const [response, setResponse]: [Response, Function] = useState({status: "loading"});

	useEffect(() => {
		function statusListener(status: Status) {
			setUserStatus((prevUserStatus: Map<string, string>) => {
				prevUserStatus.set(status.login, status.status);
				return (new Map(prevUserStatus));
			})
		}

		socket.on('status', statusListener);
		socket.emit('getStatus');
		return () => {socket.off('status')};
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
		const status: string | undefined = userStatus.get(element.login);
		element.status = status ? status : "offline";
	});
	return (
		<>
			<List sx={{
		  			overflow: 'auto',
		  			maxHeight: 1000,
				}}>
				{users?.map((user: UserData) => (
					<div key={user.id} className="px-4">
						<ProfileElement user={user} />
					</div>
				))}
			</List>
		</>
	);
}
