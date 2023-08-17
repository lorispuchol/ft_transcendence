import { Add, Close, Search } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { ChangeEvent, useState } from "react";
import './chat.css'

interface CreateChanPopProps {
	setIsOpen: Function;
}

function CreateChanPop({setIsOpen}: CreateChanPopProps) {
	const [chanName, setChanName]: [string, Function] = useState('');
	const [mode, setMode]: [string, Function] = useState('')
	const [password, setPassword]: [string, Function] = useState('');

	function chanNameChange(event: ChangeEvent<HTMLInputElement>) {
		setChanName(event.target.value)
	}
	
	function passwordChange(event: ChangeEvent<HTMLInputElement>) {
		setPassword(event.target.value)
	}

	
	function modeChange(event: any) {
		setMode(event.target.value)

	}
	
	function createChan() {
		return mode
	}

	return (
		<div className="create-channel-popup">
			<IconButton onClick={() => setIsOpen(false)}><Close /></IconButton>
			<form onSubmit={createChan}>
				<input type="text" value={chanName} autoFocus placeholder="USERNAME" onChange={chanNameChange} />
			</form>
			<select name="mode" value={mode} id="mode-select" onChange={modeChange}>
				<option value="">--Please choose an option--</option>
				<option value="public">Public</option>
				<option value="protected">Protected</option>
				<option value="private">Private</option>
			</select>
			<form onSubmit={createChan}>
				<input type="password" value={password} placeholder="PASSWORD" onChange={passwordChange} />
			</form>
			<div>
				<button  onClick={() => createChan()}>CREATE CHAN</button>
			</div>
		</div>
	)
}





export default function ChannelNav() {

	const [isOpen, setIsOpen]: [boolean, Function] = useState(false);

	return (
		<div>
			<IconButton
				className="MuiButton-conv"
				onClick={() => setIsOpen(true)}
			>
				<Add />
			</IconButton>
			{isOpen && <CreateChanPop setIsOpen={setIsOpen}/>}
		</div>
	)
}
