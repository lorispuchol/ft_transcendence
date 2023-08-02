import { useEffect, useState } from "react";
import SocketChat from "./SocketChat";
import { GetRequest } from "../utils/Request";
import Loading from "../utils/Loading";
import ErrorHandling from "../utils/Error";
import { useLocation } from "react-router-dom";
import { Button } from "@mui/material";


export enum ChanMode {
	PUBLIC = "public",
	PROTECTED = "protected",
	PRIVATE = "private",
	DM = "dm"
}
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
	chanName?: string;
	chans?: ChannelData[]
	focusConv: string,
	setFocusConv: Function,
}

function handleClick(chanName: string, setfocusConv: Function) {
	setfocusConv(chanName);
}

function ListConv({focusConv, setFocusConv}: focusConvProps) {
	const [response, setResponse]: [Response, Function] = useState({status: "loading"});
	useEffect(() => {
			GetRequest("/chat/getConvs").then((response) => setResponse(response));
	}, [focusConv]);

	if (response.status === "loading")
		return (<Loading />);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);

	const dms: ChannelData[] | undefined  = response.data?.filter((conv) => conv.mode === ChanMode.DM)
	const chans: ChannelData[] | undefined  = response.data?.filter((conv) => conv.mode !== ChanMode.DM)
	return (
		<>
			<strong>{focusConv}</strong>
			
			<div className="list-button-conv">

					{
						dms?.map((chan) => (
							<Button
								onClick={() => handleClick(chan.name, setFocusConv)}
							>
								{chan.name}
							</Button>
						))
					}
				
			
					{
						chans?.map((chan) => (
							<Button 
								onClick={() => handleClick(chan.name, setFocusConv)}
							>
								{chan.name}
							</Button>
						))
						
					}
			</div>
		</>
	)
}

export default function Chat() {
	const location = useLocation();
	const [focusConv, setFocusConv]: [string, Function] = useState(location.state?.to);


	return (
		<div>
			<header>
				Chat
			</header>
			<div className="chat-page">
				<ListConv focusConv={focusConv} setFocusConv={setFocusConv} />
				<SocketChat />
			</div>
		</div>

	  );
}