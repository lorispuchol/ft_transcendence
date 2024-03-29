import { useEffect, useState } from "react";
import { GetRequest } from "../utils/Request";
import { IconButton } from "@mui/material";
import { Message } from "@mui/icons-material";
import { useNavigate} from "react-router-dom";
import ErrorHandling from "../utils/Error";
import { RelationData } from "./interfaceData";

interface Res {
	status: string | number,
	data?: RelationData,
	error?: string,
}

export default function MessageButton({receiverId}: {receiverId: number}) {

	const [res, setRes]: [Res, Function] = useState({status: "loading"});
	
	let block: boolean = false;
	const navigate = useNavigate();
	
	useEffect(() => {
		GetRequest("/relationship/user/" + receiverId).then((res) => setRes(res));
	}, [receiverId])
	if (res.status === "loading")
		return (<IconButton><Message /></IconButton>);
	if (res.status !== "OK")
		return (<ErrorHandling status={res.status} message={res.error} />);

	if (res.data?.status === "blockedYou" || res.data?.status === "blocked") {
		block = true;
	}

	function handleClick() {

		GetRequest("/chat/getDm/" + receiverId)
			.then((res) => navigate("/chat", {replace: true, state: {to: (res as any).data?.name}}))
	}
	
	return (
			<IconButton onClick={handleClick} disabled={block} color="inherit" className="rounded-none">
				<Message />
			</IconButton>
	)
}