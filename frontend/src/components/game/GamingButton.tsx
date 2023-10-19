import { VideogameAsset } from "@mui/icons-material"
import { Button } from "@mui/material"
import { primaryColor, secondaryColor } from "../../style/color"
import { useContext, useEffect, useState } from "react";
import { GetRequest } from "../../utils/Request";
import { useNavigate } from "react-router-dom";
import { EventContext } from "../../utils/Context";

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

export default function GamingButton({ login }: {login: string}) {
	const [response, setResponse]: [Response, Function] = useState({status: "loading"});
	const [block, setBlock]: [boolean, Function] = useState(false);
	const socket = useContext(EventContext)!;
	const navigate = useNavigate();

	useEffect(() => {
		GetRequest("/relationship/user/" + login).then((response) => {
			setResponse(response);
			if (response.data)
				setBlock(response.data!.status === "blocked" || response.data!.status === "blockedYou");
		});
	}, [login]);
	if (response.status === "loading")
		return (<Button sx={{backgroundColor: primaryColor}} color="inherit" variant="outlined" startIcon={<VideogameAsset />}>defy</Button>);

	function handleClick() {
		socket.emit("defyButton", response.data?.userId);
		navigate("/game");
	}


	return (
		block ?
			<Button disabled variant="outlined" startIcon={<VideogameAsset />}>defy</Button>
		:
			<Button onClick={handleClick} sx={{backgroundColor: primaryColor, "&:hover": {backgroundColor: secondaryColor}}} color="inherit" variant="outlined" startIcon={<VideogameAsset />}>defy</Button>
	);
}
