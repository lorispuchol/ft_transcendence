import { useEffect, useState } from "react";
import { GetRequest } from "../utils/Request";
import Loading from "../utils/Loading";
import ErrorHandling from "../utils/Error";
import { Button, IconButton } from "@mui/material";
import { Message } from "@mui/icons-material";
import { NavLink, useNavigate} from "react-router-dom";


interface RelationData{
	status: string,
}

interface Res {
	status: string | number,
	data?: RelationData,
	error?: string,
}

interface MessageButtonProps {
	receiver: string
}

export default function MessageButton({receiver}: MessageButtonProps) {

	const [response, setResponse]: [Res, Function] = useState({status: "loading"});
	let block: boolean = false;

	const navigate = useNavigate();
	useEffect(() => {
		GetRequest("/relationship/" + receiver).then((res) => setResponse(res));
	}, [receiver])
	if (response.data?.status === "blockedYou" || response.data?.status === "blocked") {
		block = true;
	}

	function handleClick() {
		
		GetRequest("/chat/getDm/" + receiver)
			.then(() => navigate("/chat", {replace: true, state: {to: receiver}}))
	}

	return (
		<>
			<IconButton onClick={handleClick} disabled={block}>
				<Message />
			</IconButton>
		</>
	)
}