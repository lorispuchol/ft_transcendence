import { Logout } from "@mui/icons-material";
import { IconButton, Paper } from "@mui/material";
import { client_url } from "../../utils/Request";
import Everyone from "../../components/user/Everyone";
import Header from "../../components/home/Header"
import Us from "../../components/home/Us";
import './Home.scss';


export default function Home() {
	// const token = "token: " + localStorage.getItem("token");

	function disconnect() {
		localStorage.clear();
		window.location.replace(client_url);
	}

	return (
		<div>
			<Header />
			<div className="list_container">
				<Everyone />
			</div>
			<Us />
			{/* <div className="us">
					<Paper className="">
						Bonjour bonjour
					</Paper>
					<Paper> OUE OUE</Paper>
					<Paper> OUE OUE</Paper> */}
				{/* <div className="left_elem">
					<Paper className="break-words">{token}</Paper>
					<div className="p-2">
						<Paper className="w-min p-1">
							<IconButton onClick={disconnect}><Logout color="error"/></IconButton>
						</Paper>
					</div>
				</div> */}
				{/* <div className="list_container"> */}
				{/* </div> */}
			{/* </div> */}
			<div><Paper className="!w-min"><IconButton onClick={disconnect}><Logout color="error"/></IconButton></Paper></div>
		</div>
	);
}
