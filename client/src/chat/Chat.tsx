import { useContext, useEffect, useState } from "react";
import SocketChat from "./SocketChat";
import { UserContext } from "../utils/Context";
import { GetRequest } from "../utils/Request";
import Loading from "../utils/Loading";
import ErrorHandling from "../utils/Error";

interface ChannelData {
	id: number, 
	name: string,
	mode: string,
	password: string | null;
}
interface Response {
	status: string | number,
	data?: ChannelData[],
	error?: string,
}

export default function Chat() {

	const [response, setResponse]: [Response, Function] = useState({status: "loading"});
	useEffect(() => {
			GetRequest("/chat/allDiscuss").then((response) => setResponse(response));
	}, []);
	
	if (response.status === "loading")
		return (<Loading />);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);
	return (
		<div>
			<header>
				Chat
			</header>
			{response.data?.map((dt) => dt.name)}
			<SocketChat />
		</div>
	  );
}