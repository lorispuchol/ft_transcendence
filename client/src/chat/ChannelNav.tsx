import { Add, AddCircleOutline, Clear, TravelExplore } from "@mui/icons-material";
import { FormControl, FormControlLabel, FormGroup, FormLabel, Paper, Radio, RadioGroup } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import './chat.scss'
import { GetRequest, PostRequest } from "../utils/Request";
import { ToastContainer, toast } from "react-toastify";
import { SocketChatContext } from "../utils/Context";
import { ChanMode, ChannelData } from "./interfaceData";
import Loading from "../utils/Loading";
import ErrorHandling from "../utils/Error";

interface Response {
	status: string | number,
	data?: ChannelData[],
	error?: string,
}

interface JoinButtonProps {
	chan: string,
	mode: ChanMode,
	setInputPw: Function,
	reRender: number;
	setRerender: Function
}

function logWarn(warn: string) {
	toast.warn(warn, {
		position: "bottom-left",
		autoClose: 2000,
		hideProgressBar: true,
	});
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

function InputPassword({chan, mode, setInputPw, reRender, setRerender}: JoinButtonProps) {

}

function JoinButton ({chan, mode, setInputPw, reRender, setRerender}: JoinButtonProps) {

	const socket = useContext(SocketChatContext);

	function join () {
		if (mode === ChanMode.PROTECTED) {
			setInputPw(true)
			return ;
		}
		PostRequest("/chat/joinPubChan/" + chan, {}).then((response: any) => {
			if (response.status === "OK") {
				if (response.data.status === "KO")
					logWarn(response.data.description)
				else {
					socket!.emit('message',chan, "Hello Everybody!");
					logSuccess(response.data.description)
					setRerender(reRender + 1);
				}	
			}
			else
				logError(response.error)
		});
	}

	return (
		<button onClick={join} className="w-fit btn btn-active bg-white btn-neutral hover:bg-purple-900 m-0">JOIN</button>
	)
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
				<FormLabel className=" text-inherit mb-3 text-base font-semibold">CREATE YOUR OWN CHANNEL</FormLabel>
				<form onSubmit={submitChannel}>
					<FormGroup>
						<input className="input w-full max-w-xs bg-white mb-3 text-inherit text-black" value={datasChan.channelName} onChange={changeName} name="name" placeholder="Channel Name" />	
						<input className="input w-full max-w-xs bg-white mb-3 text-inherit" disabled={datasChan.mode !== ChanMode.PROTECTED} type="password" placeholder="Password" value={datasChan.password} onChange={changePw} name="password" />	
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
						<FormControlLabel value={ChanMode.PROTECTED} control={<Radio color="default"/>} label="Protected by a password" />
					</RadioGroup>
					<button className="w-full btn btn-active bg-white btn-neutral hover:bg-purple-900" type="submit" ><Add/></button>
				</form>
			</FormControl>
		</div>
	  );
}

function Explore() {

	const [reRender, setReRender]: [number, Function] = useState(0);
	const [inputPw, setInputPw]: [boolean, Function] = useState(false);

	const [response, setResponse]: [Response, Function] = useState({status: "loading"});
	useEffect(() => {
			GetRequest("/chat/getNoConvs/").then((response) => setResponse(response));
	}, [reRender]);
	if (response.status === "loading")
		return (<Loading />);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);

	if (!response.data)
		return null
	if (!response.data[0])
		return <div className="m-4">No channels to join</div>
	return (				 
		<ul className="m-5 w-full h-full flex flex-col justify-start overflow-y-scroll">
			{response.data.map(( chan ) => {
				if (inputPw === true)
					return (
						<div key="++" className="flex my-1 w-full justify-center">
							<p>InputPassword</p>
						</div>
					)
				else
					return (
						<li className="flex justify-between w-full px-2 items-center my-1" key={chan.name}>
							<p className="text-lg">#{chan.name}</p>
							<JoinButton chan={chan.name} mode={chan.mode} setInputPw={setInputPw} reRender={reRender} setRerender={setReRender}/>
						</li>
					)
			})}
		</ul>
	)
}

function PopUp({children, close}: any) {
	return (
		<div className="popup-bg" onClick={close}>
			<Paper elevation={10} className="popup-box rounded-lg bg-inherit min-w-[14rem] min-h-[18rem] max-h-[32rem]" onClick={e => e.stopPropagation()}>
				<div className="flex flex-row justify-end w-full">	
					<button className="text-inherit rounded-full hover:bg-zinc-400" onClick={close}>
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
				<button className="tooltip btn btn-neutral h-1/3 w-1/3 m-5" data-tip="Explore Channels" onClick={() => setActivePopUp("explore")}>
					<TravelExplore fontSize="large"/>
				</button>
				<button className="tooltip btn btn-neutral h-1/3 w-1/3 m-5" data-tip="Create Channel" onClick={() => setActivePopUp("create")}>
					<AddCircleOutline fontSize="large"/>
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