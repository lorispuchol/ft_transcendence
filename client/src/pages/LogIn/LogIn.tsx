import { useSearchParams } from "react-router-dom";
import { PostRequest, client_url, server_url } from "../../utils/Request";
import Loading from "../../utils/Loading";
import './LogIn.scss'
import '../../fonts/Poppins/Poppins-Regular.ttf';
import { ChangeEvent, FormEvent, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function logError(error: string[]) {
	toast.error(error[0], {
		position: "bottom-left",
		autoClose: 2000,
		hideProgressBar: true,
	});
}

function LogInput() {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('');

	function usernameChange(event: ChangeEvent<HTMLInputElement>) {
		setUsername(event.target.value)
	}

	function passwordChange(event: ChangeEvent<HTMLInputElement>) {
		setPassword(event.target.value);
	}

	function login(e: FormEvent) {
		e.preventDefault();
		PostRequest("/auth/login", {username, password})
			.then((response: any) =>{
				if (response.status === "OK")
					window.location.href= client_url + "/login?token=" + response.data.token;
				else
					logError(response.error);
			}); 
	}

	function signup() {
		PostRequest("/auth/signup", {username, password})
			.then((response: any) =>{
				if (response.status === "OK")
					window.location.href= client_url + "/login?token=" + response.data;
				else
					logError(response.error);
			});
	}

	return (
		<div>
			<form className="form_box" onSubmit={login}>
				<input className="input_box" type="text"  value={username} autoFocus placeholder="USERNAME" onChange={usernameChange} />
			</form>
			<form className="form_box" onSubmit={login}>
				<input className="input_box" type="password"  value={password} placeholder="PASSWORD" onChange={passwordChange} />
			</form>
			<div className="button_box">
				<button className="button_login active:scale-110" onClick={login}>LOG IN</button>
			</div>
			<div className="button_box">
				<button className="button_login button_login_bis active:scale-110" onClick={signup}>SIGN UP</button>
			</div>
			<ToastContainer />
		</div>
	)
}

export default function LogIn() {
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

	return (
		<div className="box_login background_box_login">
			<div>
				<div className="title_box">EL PONGO</div>
				<div className="button_box">
					<button className="button_login active:scale-110" onClick={clickButton}>LOG IN WITH 42</button>
				</div>
			</div>
			<hr className="divider" />
			<LogInput />
		</div>
	);
}
