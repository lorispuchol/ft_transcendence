import { Add, AddCircleOutline, Clear, TravelExplore } from "@mui/icons-material";
import { Button, FormControl, FormControlLabel, FormGroup, FormLabel, IconButton, Paper, Radio, RadioGroup, TextField } from "@mui/material";
import { useContext, useState } from "react";
import './chat.css'
import { PostRequest } from "../utils/Request";
import { ToastContainer, toast } from "react-toastify";
import { SocketChatContext } from "../utils/Context";
import { ChanMode } from "./interfaceData";

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


function Create({close}: any) {

	const socket = useContext(SocketChatContext);

	const [datasChan, setDatasChan] = useState({
		channelName: "",
		password: "",
		mode: ChanMode.PUBLIC,
	});
	
	const changeName = (event: React.ChangeEvent<HTMLInputElement>) => {
		setDatasChan({
			...datasChan,
			channelName: event.target.value,
		});
	};

	const changeMode = (event: React.ChangeEvent<HTMLInputElement>) => {
		setDatasChan({
			...datasChan,
			mode: event.target.value as ChanMode,
		});
	};

	const changePw = (event: React.ChangeEvent<HTMLInputElement>) => {
		setDatasChan({
			...datasChan,
			password: event.target.value,
		});
	};

	function submitChannel(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const channelName = datasChan.channelName;
		const mode: ChanMode = datasChan.mode;
		const password = datasChan.password;

		if (mode === ChanMode.PROTECTED) {
			PostRequest("/chat/createChanWithPw", {channelName, password, mode}).then((response: any) => {
				if (response.status === "OK"){
					socket!.emit('message',channelName, "Welcome To Everybody!");
					close();
					logSuccess(`Channel ${channelName} created successfully`)
				}
				else
					logError(response.error);
			});
		}
		else {
			PostRequest("/chat/createChanWithoutPw", {channelName, mode}).then((response: any) => {
				if (response.status === "OK"){
					socket!.emit('message',channelName, "Welcome To Everybody!");
					close();
					logSuccess(`Channel ${channelName} created successfully`)
				}
				else
					logError(response.error);
			});
		}
	}
	
	  return (
		<div>
			<FormControl>
				<p>Create your own channel</p>
				<FormLabel className="text-red-700">Create your own channel</FormLabel>
				<form onSubmit={submitChannel}>
					<FormGroup> 

					<TextField label="New channel name" value={datasChan.channelName} onChange={changeName} name="name" />	
					{
						datasChan.mode === ChanMode.PROTECTED &&
						<TextField type="password" label="Password" value={datasChan.password} onChange={changePw} name="password" />	
					}
					</FormGroup>
					<RadioGroup
						onChange={changeMode}
						value={datasChan.mode}
						aria-labelledby="demo-radio-buttons-group-label"
						defaultValue="public"
						name="radio-buttons-group"
					>
						<FormControlLabel value={ChanMode.PUBLIC} control={<Radio />} label="Public" />
						<FormControlLabel value={ChanMode.PRIVATE} control={<Radio />} label="Private" />
						<FormControlLabel value={ChanMode.PROTECTED} control={<Radio />} label="Protected" />
					</RadioGroup>
					<Button type="submit" ><Add/></Button>
				</form>
			</FormControl>
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
		<div className="popup-bg" onClick={close}>
			<Paper elevation={6} className="popup-box relative elevation" onClick={e => e.stopPropagation()}>
				<button className="absolute top-0 right-0" onClick={close}>
					<Clear />
				</button>
				{children}
			</Paper>
		</div>
	)
} 

export default function ChannelNav() {

	const [activePopUp, setActivePopUp]: [string, Function] = useState("")

	return (
		<>
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
							{activePopUp === "create" ? <Create close={() => setActivePopUp("")}/> : <Explore />}
						</PopUp>
				}
			</div>
			<ToastContainer />
		</>
		
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