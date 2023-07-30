import { useContext, useEffect, useState } from "react";
import SocketChat from "./SocketChat";
import { UserContext } from "../utils/Context";
import { GetRequest } from "../utils/Request";
import Loading from "../utils/Loading";
import ErrorHandling from "../utils/Error";
import { useLocation } from "react-router-dom";

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
	const location = useLocation()

	const [response, setResponse]: [Response, Function] = useState({status: "loading"});
	useEffect(() => {
			GetRequest("/chat/allDiscuss").then((response) => setResponse(response));
	}, []);
	
	if (response.status === "loading")
		return (<Loading />);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);

	if (location.state)
		return (<strong>{location.state.to}</strong>)
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