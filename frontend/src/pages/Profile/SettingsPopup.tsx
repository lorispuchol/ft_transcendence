import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ClickAwayListener, Divider, Paper } from '@mui/material'
import { GetRequest, PatchRequest, client_url } from "../../utils/Request";
import './SettingsPopup.scss'
import { Done } from "@mui/icons-material";
import QRCode from "react-qr-code";


function updateError(error: string[]) {
	toast.error(error[0], {
		position: "bottom-left",
		autoClose: 2000,
		hideProgressBar: true,
	});
}

export default function SettingsPopup({ close, login }: {close: any, login: string}) {
	const [newUsername, setNewUsername]: [string, Function] = useState('')
	const [pp, setPp]: [File | null, Function] = useState(null);
	const [faActived, setFaActived]: [boolean, Function] = useState(false);
	const [qrCode, setQrCode]: [string, Function] = useState("");

	useEffect(() => {
		GetRequest("/user/on2fa").then((response) => {
			if (response.status === "OK")
				setFaActived(response.data);
		})
	}, []);

	function usernameChange(event: ChangeEvent<HTMLInputElement>) {
		setNewUsername(event.target.value);
	}

	function ppChange(event: ChangeEvent<HTMLInputElement>) {
		const reader = new FileReader();

		const files = (event.target as HTMLInputElement).files;
		if (!files || files.length === 0)
			return ;
		
		const imageFile = files[0];
		reader.onload = (e: any) => {
    		const img = new Image();
      		img.onload = () => {
				setPp(imageFile);
      		};
      		img.onerror = () => {
        		updateError(["bad file"]);
        		return false;
      		};
			img.src = e.target.result;
    	};
    	reader.readAsDataURL(imageFile);
	}

	function updateUsername(e: FormEvent) {
		e.preventDefault();
		let toLogin = "";
		if (newUsername === login)
			toLogin = "ToLogin";
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
		if (!pp)
			return ;
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
				window.location.reload();
			else
				updateError(response.error);
		})
	}


	function activate2fa() {
		GetRequest("/auth/setup2FA").then((response:any) => {
			if (response.status === "OK")
			{
				setQrCode(response.data.otp_url);
				setFaActived(true);
			}
			else
				updateError(response.error);
		});
	}

	function desactivate2fa() {
		GetRequest("/auth/rm2FA").then((response:any) => {
			if (response.status === "OK")
			{
				setFaActived(false);
				setQrCode("");
			}
		});
	}

	return (
		<div className='flex justify-center items-center'>
			<div className="settings_bg justify-center">
				<ClickAwayListener onClickAway={close}>
					<Paper className='settings_box'>
						<button className='close_button' onClick={close}>X</button>
						<form className='settings_option' onSubmit={updateUsername}>
							<div className="settings_text">Change username</div>
							<input type='text' className="username_input" value={newUsername} onChange={usernameChange} />
							<button className='update_button ml-7' onClick={updateUsername}><Done/></button> 
						</form>
						<Divider/>
						<form className='settings_option' onSubmit={updatePp}>
							<div className="settings_text">Change avatar</div>
							<input type='file' accept='/image/*' onChange={ppChange} />
							<button className='update_button' onClick={updatePp}><Done/></button>
						</form>
						<Divider/>
						<div className="settings_option flex justify-between">
							{
								faActived ?
								<>
									<div className="settings_text">Desactivate 2FA</div>
									<button className='update_button' onClick={desactivate2fa}><Done/></button>
								</>
								:
								<>
									<div className="settings_text">Activate 2FA</div>
									<button className='update_button' onClick={activate2fa}><Done/></button>
								</>
							}
						</div>
						{qrCode &&
							<div className="qr_code">
								<QRCode value={qrCode}/>
							</div>
						}
					</Paper>
				</ClickAwayListener>
				<ToastContainer />
			</div>
		</div>
	  );
}
