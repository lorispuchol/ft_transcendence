import { VideogameAsset } from "@mui/icons-material"
import { Button } from "@mui/material"
import { primaryColor, secondaryColor } from "../../style/color"
import { useContext, useEffect, useState } from "react";
import { GetRequest } from "../../utils/Request";
import ErrorHandling from "../../utils/Error";
import { useNavigate } from "react-router-dom";
import { EventContext } from "../../utils/Context";

interface GamingButtonProps {
	login: string
}

interface FriendshipData {
	status: string,
	description: string
	userId?: number,
}

interface Response {
	status: string | number,
	data?: FriendshipData,
	error?: string,
}

export default function GamingButton({ login }: GamingButtonProps) {
	const [response, setResponse]: [Response, Function] = useState({status: "loading"});
	const [block, setBlock]: [boolean, Function] = useState(false);
	const socket = useContext(EventContext)!;
	const navigate = useNavigate();

	useEffect(() => {
		GetRequest("/relationship/user/" + login).then((response) => {
			setResponse(response);
			if (response.data)
				setBlock(response.data!.statuss === "blocked" || response.data!.status === "blockedYou");
		});
	}, [login, setBlock]);
	if (response.status === "loading")
		return (<Button sx={{backgroundColor: primaryColor}} color="inherit" variant="outlined" startIcon={<VideogameAsset />}>challenge</Button>);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);

	function handleClick() {
		socket.emit("defyButton", response.data?.userId);
		navigate("/game");
	}


	if (block)
		return (<Button disabled variant="outlined" startIcon={<VideogameAsset />}>challenge</Button>);
	return (
			<Button onClick={handleClick} sx={{backgroundColor: primaryColor, "&:hover": {backgroundColor: secondaryColor}}} color="inherit" variant="outlined" startIcon={<VideogameAsset />}>challenge</Button>
	);
}
