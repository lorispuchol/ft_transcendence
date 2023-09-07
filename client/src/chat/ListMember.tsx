import { useEffect, useState } from "react";
import { GetRequest } from "../utils/Request";
import ErrorHandling from "../utils/Error";
import Loading from "../utils/Loading";
import { ParticipantData } from "./interfaceData";

interface ResponseMembers {
	status: string | number,
	data?: ParticipantData[],
	error?: string,
}

interface ListMembersProps {
	chan: string
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
		<div>
			{
				response.data.map(( member ) => <div key={member.user.login}>{member.user.username}</div>)
			}
		</div>
	)
	
}