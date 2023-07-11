import { useSearchParams } from "react-router-dom";
import { client_url, server_url } from "../../utils/Request";
import Loading from "../../utils/Loading";
import { Box } from "@mui/material";
import './LogIn.scss'
import { ChangeEvent, useState } from "react";

export default function LogIn() {

	const [username, setUsername] = useState('username')


	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setUsername(event.target.value)
	}

	const [searchParams] = useSearchParams();
	const tokenParam = searchParams.get("token");
	if (tokenParam)
	{
		localStorage.setItem("token", tokenParam);
		window.location.replace(client_url);
		return (<Loading />);
	}
	return (
		<Box className="box-border justify-center flex flex-col foreground_login w-80 h-110 ring ring-black">
			<h1 className="flex justify-center text-4xl font-poppins font-bold mb-8">EL PONGO</h1>
			<div className="flex justify-center">
				<button className="button_login flex justify-center text-2xl rounded hover:bg-purple-300 ring ring-black w-32 mb-8">
					<a className="font-poppins font-bold" href={server_url + "/auth/"} >LOG IN WITH 42</a>
				</button>
			</div>

			<h2 className="flex justify-center text-2xl font-poppins font-bold mb-8 mt-10">Or with username</h2>
			<div className="flex justify-center">
			<form>
				<input  type="text"  value={username} onChange={handleChange} />
			</form>
				<button className="button_login flex justify-center text-2xl rounded hover:bg-purple-300 ring ring-black w-32 mb-8">
					<a className="font-poppins font-bold" href={server_url + "/auth/loginByUsername/" + username} >Send</a>
				</button>
			</div>
		</Box>
	);
}
