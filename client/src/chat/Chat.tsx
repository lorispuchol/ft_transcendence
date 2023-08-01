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

interface focusConvProps {
	focusConv: string,
}


function ListConv({focusConv}: focusConvProps) {
	const [response, setResponse]: [Response, Function] = useState({status: "loading"});
	useEffect(() => {
			GetRequest("/chat/getConvs").then((response) => setResponse(response));
	}, [focusConv]);

	console.log(response)

	if (response.status === "loading")
		return (<Loading />);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);

	return (
		<>
			<strong>{focusConv}</strong>
			{response.data?.map((chan) => chan.name)}
		</>
	) 
}

export default function Chat() {
	const location = useLocation();
	const to: string = location.state ? location.state.to : null;

	return (
		<div>
			<header>
				Chat
			</header>
			<ListConv focusConv={location.state?.to}/>
			<SocketChat />
		</div>
	  );
}