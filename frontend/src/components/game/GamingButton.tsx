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
				GetRequest("/game/inGame/" + id).then((response) => {
					if (response.data)
						setInGame(response.data);
				});
			}
		});
		

		function updateInGame(status: boolean) {
			setInGame(status);
		}
		socket.on("inGame/" + id, updateInGame);

		return (() => {socket.off("inGame/" + id, updateInGame)});
	}, [id, socket]);
	if (response.status === "loading" || block)
		return (<Button disabled variant="outlined" startIcon={<VideogameAsset />}>defy</Button>);

	function handleDefy() {
		socket.emit("defyButton", response.data?.userId);
		navigate("/game");
	}

	function handleSpec() {

	}

	if (inGame)
		return (
			<Button onClick={handleSpec} sx={{
				backgroundColor: primaryColor, 
				"&:hover": {backgroundColor: secondaryColor}}} 
			color="inherit" variant="outlined" startIcon={<VideogameAsset />}>spectate</Button>
		);

	return (
			<Button onClick={handleDefy} sx={{
				backgroundColor: primaryColor, 
				"&:hover": {backgroundColor: secondaryColor}}} 
			color="inherit" variant="outlined" startIcon={<VideogameAsset />}>defy</Button>
	);
}
