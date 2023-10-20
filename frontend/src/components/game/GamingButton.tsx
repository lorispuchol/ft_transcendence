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

export default function GamingButton({ id }: {id: number}) {
	const [response, setResponse]: [Response, Function] = useState({status: "loading"});
	const [block, setBlock]: [boolean, Function] = useState(true);
	const [inGame, setInGame]: [boolean, Function] = useState(false);
	const socket = useContext(EventContext)!;
	const navigate = useNavigate();

	useEffect(() => {
		GetRequest("/relationship/user/" + id).then((response) => {
			setResponse(response);
			if (response.data)
			{
				setBlock(response.data!.status === "blocked" || response.data!.status === "blockedYou");
				GetRequest("/game/inGame/" + response.data.userId).then((response) => {
					if (response.data)
						setInGame(response.data);
				});
			}
		});
	}, [id]);
	if (response.status === "loading" || block)
		return (<Button disabled variant="outlined" startIcon={<VideogameAsset />}>defy</Button>);

	function handleClick() {
		socket.emit("defyButton", response.data?.userId);
		navigate("/game");
	}

	if (inGame)
		return (
			<Button onClick={handleClick} sx={{
				backgroundColor: primaryColor, 
				"&:hover": {backgroundColor: secondaryColor}}} 
			color="inherit" variant="outlined" startIcon={<VideogameAsset />}>spectate</Button>
		);

	return (
			<Button onClick={handleClick} sx={{
				backgroundColor: primaryColor, 
				"&:hover": {backgroundColor: secondaryColor}}} 
			color="inherit" variant="outlined" startIcon={<VideogameAsset />}>defy</Button>
	);
}
