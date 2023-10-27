import { useEffect, useState } from "react"
import { GetRequest } from "../../utils/Request";
import FriendListElem from "./FriendListElem";
import Loading from "../../utils/Loading";
import ErrorHandling from "../../utils/Error";

import './FriendList.scss'
import { Paper } from "@mui/material";

interface UserData {
	id: number,
	avatar: string,
	login: string,
	username: string
}

interface Response {
	status: string,
	data?: UserData[],
	error?: string
}

export default function FriendList( {userId}: {userId: number} ) {
	const [response, setResponse]: [Response, Function] = useState({status: "loading"});
	const [users, setUsers]: [UserData[], Function] = useState([]);

	useEffect(() => {
		GetRequest("/user/friendlist/" + userId).then((response) => {
			setResponse(response);
			if (response.data)
				setUsers(response.data)
		});
	}, [userId]);
	if (response.status === "loading")
		return (<Loading />);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);
	return (
		<div className="flex flex-col">
			<Paper className="place-self-center mb-8 p-2">FRIEND LIST</Paper>
			<div className="friendlist_list">
				{users.length >= 1 ?
					users.map((user: UserData) => (
						<FriendListElem key={user.id} user={user} />
					))
					:
					<Paper className="p-1">NO FRIEND</Paper>
				}
			</div>
		</div>
	)
}