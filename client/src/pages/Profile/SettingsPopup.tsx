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
	const [pp, setPp] = useState<any>()

	function usernameChange(event: ChangeEvent<HTMLInputElement>) {
		setUsername(event.target.value);
	}

	function ppChange(event: ChangeEvent<HTMLInputElement>) {
		const files = (event.target as HTMLInputElement).files;
		if (files && files.length > 0)
			setPp(files[0]);
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
		const formData = new FormData();
		formData.append('file', pp);
		PatchRequest("/user/avatar", formData)
		.then ((response:any) => {
			if (response.status === "OK")
				window.location.href = client_url + "/profile/" + username;
			else
				updateError(response.error);
		})
	}

	return (
		<div className='flex justify-center items-center'>
			<div className="settings_bg justify-center">
				<div>
					<Paper className='settings_box'>
						<button className='close_button' onClick={close}>X</button>
						<form className='settings_option mt-5' onSubmit={updateUsername}>
							Username: <input type='text' value={username} onChange={usernameChange} />
							<button className='update_button' onClick={updateUsername}>UPDATE</button> 
						</form>
						<form className='settings_option' onSubmit={updatePp}>
							Modifier photo de profile: <input type='file' accept='/image/*' onChange={ppChange} />
							<button className='update_button' onClick={updatePp}>UPDATE</button>
						</form>
					</Paper>
					<ToastContainer />
				</div>
			</div>
		</div>
	  );
}
