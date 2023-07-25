import { Paper } from "@mui/material";

export default function Home() {
	const token = "token: " + localStorage.getItem("token");
	return (
		<>
			<div><strong><u>home</u></strong></div>
			<Paper sx={{
		  			overflow: 'auto',
		  			maxHeight: 244,
		  			'& ul': { padding: 0 },
				}}>
				{token}
			</Paper>
		</>
	);
}
