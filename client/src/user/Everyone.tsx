import { useContext, useEffect, useState } from "react";
import { GetRequest } from "../utils/Request";
import Loading from "../utils/Loading";
import ErrorHandling from "../utils/Error";
import EventList from "../components/event/EventList";
import FriendInvitation from "../components/Relationship/FriendInvitation";
import { UserContext } from "../utils/UserContext";

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

export default function Everyone()
{

	const username = useContext(UserContext)

	const [response, setResponse]: [Response, Function] = useState({status: "loading"});
	useEffect(() => {
			GetRequest("/user/all").then((response) => setResponse(response));
	}, []);
	if (response.status === "loading")
		return (<Loading />);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);
	
	const users: UserData[] | undefined = response.data;
	return (
		<>
			<ul>
				{users?.map((user: UserData) => (
					user.username === username 
						?	<li key={user.id} >{user.username} </li>
						:	<li key={user.id} >{user.username} <FriendInvitation login={user.login}/></li>
				))}
			</ul>
			<EventList />
		</>
	);
}
