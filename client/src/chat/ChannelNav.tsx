import { Add, AddCircleOutline, Clear, TravelExplore } from "@mui/icons-material";
import { FormControl, FormControlLabel, FormGroup, FormLabel, IconButton, Paper, Radio, RadioGroup, TextField, colors } from "@mui/material";
import { useContext, useState } from "react";
import './chat.scss'
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
			<FormControl className="flex flex-col items-center">
				<FormLabel className="text-inherit mb-3">Create your own channel</FormLabel>
				<form onSubmit={submitChannel}>
					<FormGroup color='inherit'>
						<TextField className="mb-3 text-inherit" value={datasChan.channelName} onChange={changeName} name="name" placeholder="Channel Name" />	
						<TextField className="mb-3 text-inherit" disabled={datasChan.mode !== ChanMode.PROTECTED} type="password" placeholder="Password" value={datasChan.password} onChange={changePw} name="password" />	
					</FormGroup>
					<RadioGroup
						className="mb-3"
						onChange={changeMode}
						value={datasChan.mode}
						aria-labelledby="demo-radio-buttons-group-label"
						defaultValue="public"
						name="radio-buttons-group"
					>
						<FormControlLabel value={ChanMode.PUBLIC} control={<Radio color="default"/>} label="Public" />
						<FormControlLabel value={ChanMode.PRIVATE} control={<Radio color="default"/>} label="Private" />
						<FormControlLabel value={ChanMode.PROTECTED} control={<Radio color="default"/>} label="Protected" />
					</RadioGroup>
					<button className="w-full bg-white rounded transition hover:bg-blue-600 h-8" type="submit" ><Add/></button>
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
			<Paper elevation={10} className="popup-box rounded-lg bg-inherit" onClick={e => e.stopPropagation()}>
				<div className="flex flex-row justify-end w-full">	
					<button className="text-inherit rounded-full" onClick={close}>
						<Clear />
					</button>
				</div>
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