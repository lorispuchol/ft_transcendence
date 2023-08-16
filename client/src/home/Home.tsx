import { Logout } from "@mui/icons-material";
import { IconButton, Paper } from "@mui/material";
import { client_url } from "../utils/Request";

export default function Home() {
	const token = "token: " + localStorage.getItem("token");

	function disconnect() {
		localStorage.clear();
		window.location.replace(client_url);
	}

	return (
		<>
			<div><strong><u>home</u></strong></div>
			<Paper className="break-words">
				{token}
			</Paper>
			<div className="p-2">
				<Paper className="w-min p-1">
					<IconButton onClick={disconnect}><Logout color="error"/></IconButton>
				</Paper>
			</div>
		</>
	);
}
