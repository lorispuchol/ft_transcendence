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
}
