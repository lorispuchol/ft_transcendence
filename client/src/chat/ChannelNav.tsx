import { Add, AddCircleOutline, Clear, TravelExplore } from "@mui/icons-material";
import { FormControl, FormControlLabel, FormGroup, FormLabel, IconButton, TextField } from "@mui/material";
import { useState } from "react";
import './chat.css'
import { PostRequest } from "../utils/Request";
import { ToastContainer, toast } from "react-toastify";

interface Res {
	status: string | number,
	data?: string,
	error?: string,
}

function logError(error: string[]) {
	toast.error(error[0], {
		position: "bottom-left",
		autoClose: 2000,
		hideProgressBar: true,
	});
}


function logSuccess(msg: string) {
	toast.success(msg, {
		position: "bottom-left",
		autoClose: 2000,
		hideProgressBar: true,
	});
}


function Create() {
	const [datasChan, setStrings] = useState({
		channelName: "",
		password: "",
	});
	
	const changeName = (event: React.ChangeEvent<HTMLInputElement>) => {
		setStrings({
			...datasChan,
			channelName: event.target.value,
		});
	};

	const changePw = (event: React.ChangeEvent<HTMLInputElement>) => {
		setStrings({
			...datasChan,
			password: event.target.value,
		});
	};

	function submitChannel() {
		const channelName = datasChan.channelName;

		console.log(datasChan.channelName, datasChan.password);
		PostRequest("/chat/createChan", {channelName}).then((response: any) => {
			if (response.status === "OK")
				logSuccess(`Channel ${channelName} created successfully`)
			else
				logError(response.error);
		});
	}
	
	  return (
		<div>
			<FormControl>
				<FormLabel>{datasChan.channelName}Create your own channel</FormLabel>
				<FormGroup>
					<TextField label="New channel name" value={datasChan.channelName} onChange={changeName} name="name" />
					<IconButton onClick={submitChannel}><Add/></IconButton>
				</FormGroup>
			</FormControl>
			<ToastContainer />
		</div>
	  );
}

function Explore() {
	return (
		<div>
			<TravelExplore />
		</div>
	)
}

function PopUp({children, close}: any) {
	return (
		<div className="popup-box" onClick={close}>
			<button onClick={close}>
				<Clear />
			</button>
			<div className="popup-content" onClick={e => e.stopPropagation()}>
				{children}
			</div>
		</div>
	)
} 

export default function ChannelNav() {

	const [activePopUp, setActivePopUp]: [string, Function] = useState("")

	return (
		<div className="chan-nav">
			<button onClick={() => setActivePopUp("explore")}>
				<TravelExplore />
			</button>
			<button  onClick={() => setActivePopUp("create")}>
				<AddCircleOutline />
			</button>

			{
				activePopUp !== "" &&
					<PopUp close={() => setActivePopUp("")}>
						{activePopUp === "create" ? <Create /> : <Explore />}
					</PopUp>
			}
		</div>
	)
}

/*
<div className="create-chan-form">

<form onSubmit={createChan}>
	<TextField type="text" value={chanName} autoFocus placeholder="Channel Name" onChange={chanNameChange} />
	<Switch aria-label=""/>
</form>
<select name="mode" value={mode} id="mode-select" onChange={modeChange}>
	<option value="">--Please choose an option--</option>
	<option value="public">Public</option>
	<option value="protected">Protected</option>
	<option value="private">Private</option>
</select>
<form onSubmit={createChan}>
	<input className="bg-transparent" type="password" value={password} placeholder="PASSWORD" onChange={passwordChange} />
</form>
<CreateChanForm />
<div>
	<button  onClick={() => createChan()}>CREATE CHAN</button>
</div>



<FormControl>
<FormLabel>Create your own channel</FormLabel>
<FormGroup>
  <FormControlLabel
	control={
	  <TextField value={strings.name} onChange={changeStrings} name="name" />
	}
	label=""
  />
  <FormControlLabel
	control={
	  <Switch checked={check.private} onChange={changeCheck} name="private" />
	}
	label="turn on to make your chennal private"
  //   labelPlacement="start"
  />
  {
	  check.private === true ?
		  <FormControlLabel
		  control={
			  <TextField  value={strings.password} onChange={changeStrings} name="password" />
		  }
		  label=""
		  /> 
	  : null
  }
  <IconButton><Add/></IconButton>
</FormGroup>
</FormControl>

*/