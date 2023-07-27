import { useEffect, useState } from "react";
import { GetRequest } from "../utils/Request";
import Loading from "../utils/Loading";
import ErrorHandling from "../utils/Error";
import { IconButton } from "@mui/material";
import { Message } from "@mui/icons-material";
import { NavLink, Navigate } from "react-router-dom";


interface ChannelData{
	id: number,
	name: string,
	mode: string,
	password: string
}

interface Res {
	status: string | number,
	data?: ChannelData | null,
	error?: string,
}

interface MessageButtonProps {
	receiver: string
}

export default function MessageButton({receiver}: MessageButtonProps) {
	
	const [res, setRes]: [Res, Function] = useState({status: "inactive"});
	
	function handleClick() {
		GetRequest("/chat/getMp/" + receiver).then((res) => setRes(res))
		if (res.status === "KO")
			return (<ErrorHandling status={res.status} message={res.error} />);
		if (res.data !== null && res.data?.mode === "mp") {

			console.log("ouiiiiii");
		}
	}
	
	return (
		<>
			{/* <NavLink to={'/chat'} onClick={() => hanldeClick("profile")}>
					<IconButton onClick={handleClick}>
						<Message />
					</IconButton>
			<NavLink /> */}
			<NavLink to={'/chat'} onClick={() => handleClick()}>
				<Message />
			</NavLink>
		</>
	)
}