import { useEffect, useState } from "react";
import { GetRequest } from "../utils/Request";
import Loading from "../utils/Loading";
import ErrorHandling from "../utils/Error";
import { Avatar, List, Paper } from "@mui/material";
import { defaultAvatar } from "./Profile";
import Friendbutton from "../components/Relationship/Friendbutton";
import UserStatus from "./UserStatus";

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
			<UserStatus login={user.login} />
			<Avatar src={avatar} alt={user.username}/>
			<Paper sx={{bgcolor: "#fad390"}}>{user.username}</Paper>
			<div><Friendbutton login={user.login}/></div>
		</Paper>
	)
}



export default function Everyone()
{
	const [response, setResponse]: [Response, Function] = useState({status: "loading"});

	useEffect(() => {
			GetRequest("/user/all").then((response) => setResponse(response));
	}, []);
	if (response.status === "loading")
		return (<Loading />);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);

	
	const users: UserData[] = response.data!;
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
