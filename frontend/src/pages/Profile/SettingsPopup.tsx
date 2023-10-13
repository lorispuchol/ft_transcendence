import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ClickAwayListener, Paper } from '@mui/material'
import { PatchRequest, client_url } from "../../utils/Request";
import './SettingsPopup.scss'
import { UserContext } from "../../utils/Context";


function updateError(error: string[]) {
	toast.error(error[0], {
		position: "bottom-left",
		autoClose: 2000,
		hideProgressBar: true,
	});
}

export default function SettingsPopup({ close, login }: {close: any, login: string}) {
	const [newUsername, setNewUsername]: [string, Function] = useState('')
	const [pp, setPp] = useState<any>()
	const username = useContext(UserContext);

	useEffect(() => {
	}, []);

	function usernameChange(event: ChangeEvent<HTMLInputElement>) {
		setNewUsername(event.target.value);
	}

	function ppChange(event: ChangeEvent<HTMLInputElement>) {
		const files = (event.target as HTMLInputElement).files;
		if (files && files.length > 0)
			setPp(files[0]);
	}

	function updateUsername(e: FormEvent) {
		e.preventDefault();
		let toLogin = "";
		if (newUsername === login)
			toLogin = "ToLogin";
		console.log(newUsername)
		PatchRequest("/user/username" + toLogin, {username: newUsername})
		.then ((response:any) => {
			if (response.status === "OK")
				window.location.href = client_url + "/profile/" + newUsername;
			else
				updateError(response.error);
		})
	}

	function updatePp(e: FormEvent) {
		e.preventDefault();
		const formData = new FormData();
		formData.append('file', pp);
		const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
		if (!allowedTypes.includes(pp.type)) {
			updateError(["Only JPEG, PNG, and GIF images are allowed."]);
			return;
		  }
		if (pp.size > 800000) {
			updateError(["file size is too big"]);
			return ;
		}
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
				<ClickAwayListener onClickAway={close}>
					<Paper className='settings_box'>
						<button className='close_button' onClick={close}>X</button>
						<form className='settings_option mt-5' onSubmit={updateUsername}>
							Username: <input type='text' className="username_input" value={newUsername} onChange={usernameChange} />
							<button className='update_button' onClick={updateUsername}>UPDATE</button> 
						</form>
						<form className='settings_option' onSubmit={updatePp}>
							Modifier photo de profile: <input type='file' accept='/image/*' onChange={ppChange} />
							<button className='update_button' onClick={updatePp}>UPDATE</button>
						</form>
					</Paper>
				</ClickAwayListener>
				<ToastContainer />
			</div>
		</div>
	  );
}
