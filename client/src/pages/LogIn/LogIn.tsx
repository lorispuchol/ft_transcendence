import { useSearchParams } from "react-router-dom";
import { client_url, server_url } from "../../utils/Request";
import Loading from "../../utils/Loading";
import { Box } from "@mui/material";
import './LogIn.scss'

export default function LogIn() {
	const [searchParams] = useSearchParams();
	const tokenParam = searchParams.get("token");
	if (tokenParam)
	{
		localStorage.setItem("token", tokenParam);
		window.location.replace(client_url);
		return (<Loading />);
	}
	return (
		<Box className="box-border justify-center flex flex-col foreground_login w-72 h-96 ring ring-black">
			<h1 className="flex justify-center text-4xl font-poppins font-bold mb-8">EL PONGO</h1>
			<div className="flex justify-center">
				<button className="button_login flex justify-center text-2xl rounded hover:bg-purple-300 ring ring-black w-24 mb-8">
					<a className="font-poppins font-bold" href={server_url + "/auth/"} >LOG IN</a>
				</button>
			</div>
		</Box>
	);
}
