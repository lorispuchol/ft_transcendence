import { useSearchParams } from "react-router-dom";
import { client_url, server_url } from "../../utils/Request";
import Loading from "../../utils/Loading";
import './LogIn.scss'
import '../../fonts/Poppins/Poppins-Regular.ttf';

import { ChangeEvent, useState } from "react";

export default function LogIn() {

	const [username, setUsername] = useState('')


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

	function clickButton() {
		const url = server_url + "/auth/";
		window.location.href=url;
	}

	function clickSend(e: any) {
		e.preventDefault();
		const url = server_url + "/auth/LoginByUsername/" + username;
		window.location.href=url;
	}

	return (
		<div className="box_login background_box_login">
			<div className="title_box">EL PONGO</div>
			<div className="button_box">
				<button className="button_login active:scale-110" onClick={clickButton}>LOG IN WITH 42</button>
			</div>
			<div className="text_box">Or by username</div>
			<div className="button_box">
				<form className="form_box" onSubmit={clickSend}>
					<input className="input_box" type="text"  value={username} placeholder="username" onChange={handleChange} />
				</form>
				<button className="button_send active:scale-110" onClick={clickSend}>SEND</button>
			</div>
		</div>
	);

	// return (
	// 	<Box className="box-border justify-center flex flex-col foreground_login w-80 h-110 ring ring-black">
	// 		<h1 className="flex justify-center text-4xl font-poppins font-bold mb-8">EL PONGO</h1>
	// 		<div className="flex justify-center">
	// 			<button className="button_login flex justify-center text-2xl rounded hover:bg-purple-300 ring ring-black w-32 mb-8">
	// 				<a className="font-poppins font-bold" href={server_url + "/auth/"} >LOG IN WITH 42</a>
	// 			</button>
	// 		</div>

	// 		<h2 className="flex justify-center text-2xl font-poppins font-bold mb-8 mt-10">Or with username</h2>
	// 		<div className="flex justify-center">
	// 		<form>
	// 			<input  type="text"  value={username} onChange={handleChange} />
	// 		</form>
	// 			<button className="button_login flex justify-center text-2xl rounded hover:bg-purple-300 ring ring-black w-32 mb-8">
	// 				<a className="font-poppins font-bold" href={server_url + "/auth/loginByUsername/" + username} >Send</a>
	// 			</button>
	// 		</div>
	// 	</Box>
	// );
}
