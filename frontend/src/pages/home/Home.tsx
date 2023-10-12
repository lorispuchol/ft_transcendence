import { Logout } from "@mui/icons-material";
import { IconButton, Paper } from "@mui/material";
import { client_url } from "../../utils/Request";
import Everyone from "../../components/user/Everyone";
import './Home.scss';

export default function Home() {
	const token = "token: " + localStorage.getItem("token");

	function disconnect() {
		localStorage.clear();
		window.location.replace(client_url);
	}

	return (
		<div className="home">
			<div className="left_elem">
				<Paper className="break-words">{token}</Paper>
				<div className="p-2">
					<Paper className="w-min p-1">
						<IconButton onClick={disconnect}><Logout color="error"/></IconButton>
					</Paper>
				</div>
			</div>
			<div className="list_container">
				<Everyone />
			</div>
		</div>
	);
}
