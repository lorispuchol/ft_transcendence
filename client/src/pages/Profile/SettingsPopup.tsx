import { ChangeEvent, FormEvent, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Paper } from '@mui/material'

import { PatchRequest, client_url } from "../../utils/Request";

import './SettingsPopup.scss'


function updateError(error: string[]) {
	toast.error(error[0], {
		position: "bottom-left",
		autoClose: 2000,
		hideProgressBar: true,
	});
}

export default function SettingsPopup({ close }: any) {
	const [username, setUsername] = useState('')
	const [pp, setPp] = useState('')

	function usernameChange(event: ChangeEvent<HTMLInputElement>) {
		setUsername(event.target.value);
	}

	function ppChange(event: ChangeEvent<HTMLInputElement>) {
		setPp(event.target.value);
	}

	function updateUsername(e: FormEvent) {
		e.preventDefault();
		PatchRequest("/user/username", {username})
		.then ((response:any) => {
			if (response.status === "OK")
				window.location.href = client_url + "/profile/" + username;
			else
				updateError(response.error);
		})
	}

	function updatePp(e: FormEvent) {
		e.preventDefault();
	//PatchRequest("/user/username", {username})
	}

	return (
		<div className='flex justify-center items-center'>
			<div className="settings_bg justify-center">
				<div>
					<Paper className='settings_box'>
						<button className='close_button' onClick={close}>X</button>
						<form className='settings_option' onSubmit={updateUsername}>
							Username: <input type='text' value={username} onChange={usernameChange} />
							<button className='update_button'>UPDATE</button> 
						</form>
						<form className='settings_option' onSubmit={updatePp}>
							Modifier photo de profile: <input type='file' value={pp} onChange={ppChange} />
							<button className='update_button'>UPDATE</button>
						</form>
					</Paper>
					<ToastContainer />
				</div>
			</div>
		</div>
	  );
}
