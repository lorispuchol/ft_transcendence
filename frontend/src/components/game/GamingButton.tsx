import { VideogameAsset } from "@mui/icons-material"
import { Button } from "@mui/material"
import { primaryColor, secondaryColor } from "../../style/color"
import { useEffect, useState } from "react";
import { GetRequest } from "../../utils/Request";
import ErrorHandling from "../../utils/Error";

interface GamingButtonProps {
	login: string
}

interface FriendshipData {
	status: string,
	description: string
}

interface Response {
	status: string | number,
	data?: FriendshipData,
	error?: string,
}

export default function GamingButton({ login }: GamingButtonProps) {
	const [response, setResponse]: [Response, Function] = useState({status: "loading"});

	useEffect(() => {
		GetRequest("/relationship/" + login).then((response) => setResponse(response));
	}, [login]);
	if (response.status === "loading")
		return (<Button sx={{backgroundColor: primaryColor}} color="inherit" variant="outlined" startIcon={<VideogameAsset />}>challenge</Button>);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);

	const status: string = response.data!.status;
	if (status === "blocked" || status === "blockedYou")
		return (<Button disabled sx={{backgroundColor: primaryColor, "&:hover": {backgroundColor: secondaryColor}}} variant="outlined" startIcon={<VideogameAsset />}>challenge</Button>);
	return (
			<Button sx={{backgroundColor: primaryColor, "&:hover": {backgroundColor: secondaryColor}}} color="inherit" variant="outlined" startIcon={<VideogameAsset />}>challenge</Button>
	)
}
