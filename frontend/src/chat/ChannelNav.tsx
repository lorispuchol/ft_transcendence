import { Add, AddCircleOutline, Clear, TravelExplore } from "@mui/icons-material";
import { FormControl, FormControlLabel, FormGroup, FormLabel, Paper, Radio, RadioGroup } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import './chat.scss'
import { GetRequest, PostRequest } from "../utils/Request";
import { SocketChatContext } from "../utils/Context";
import { ChanMode, ChannelData } from "./interfaceData";
import Loading from "../utils/Loading";
import ErrorHandling from "../utils/Error";
import { logError, logSuccess, logWarn } from "./Chat";
import { useNavigate } from "react-router-dom";

interface Response {
	status: string | number,
	data?: ChannelData[],
	error?: string,
}

interface JoinButtonProps {
	channelName: string,
	mode: ChanMode,
	password: string,
}

function JoinButton ({channelName, mode, password}: JoinButtonProps) {

	const navigate = useNavigate();

	function join () {
		if (mode === ChanMode.PUBLIC) {
			PostRequest("/chat/joinPubChan/" + channelName, {}).then((response: any) => {
				if (response.status === "OK") {
					if (response.data.status === "KO")
						logWarn(response.data.description)
					else {
						navigate("/chat", {replace: true, state: {to: channelName}})
						logSuccess(response.data.description)
					}	
				}
				else
					logError(response.error)
			});
		}
		else if (mode === ChanMode.PROTECTED) {
			PostRequest("/chat/joinProtectedChan/", {channelName, password}).then((response: any) => {
				if (response.status === "OK") {
					if (response.data.status === "KO")
						logWarn(response.data.description)
					else {
						navigate("/chat", {replace: true, state: {to: channelName}})
						logSuccess(response.data.description)
					}	
				}
				else
					logError(response.error)		
			});
		}
	}

	return (
		<button onClick={join} className="w-fit btn btn-active bg-white btn-neutral hover:bg-purple-900 m-0">JOIN</button>
	)
}

function Create() {

	const socket = useContext(SocketChatContext);
	const navigate = useNavigate();

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
					logSuccess(`Channel ${channelName} created successfully`)
					navigate("/chat", {replace: true, state: {to: channelName}})
				}
				else
					logError(response.error);
			});
		}
		else {
			PostRequest("/chat/createChanWithoutPw", {channelName, mode}).then((response: any) => {
				if (response.status === "OK"){
					socket!.emit('message',channelName, "Welcome To Everybody!");
					logSuccess(`Channel ${channelName} created successfully`)
					navigate("/chat", {replace: true, state: {to: channelName}})
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
						<input className="input w-full h-11 max-w-xs bg-white mb-3 text-inherit text-black" value={datasChan.channelName} onChange={changeName} name="name" placeholder="Channel Name" />	
						<input className={`input w-full h-11 max-w-xs ${datasChan.mode === ChanMode.PROTECTED ? 'bg-white' : 'bg-gray-100'} mb-3 text-inherit text-black`} disabled={datasChan.mode !== ChanMode.PROTECTED} type="password" placeholder="Password" value={datasChan.password} onChange={changePw} name="password" />
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
					<button className="w-full h-14 btn btn-active text-slate-200 bg-purple-900 btn-neutral hover:bg-purple-700" type="submit" ><Add/></button>
				</form>
			</FormControl>
		</div>
	  );
}

function Explore() {

	const [response, setResponse]: [Response, Function] = useState({status: "loading"});
	const [inputPw, setInputPw]: [Map<string, string>, Function] = useState(new Map());

	useEffect(() => {
			GetRequest("/chat/getNoConvs/").then((response) => {
				setResponse(response)
				let temp: Map<string, string> = new Map();
				response.data.map((chan: any) => temp.set(chan.name, ""))
				setInputPw(temp)
			});
	}, []);
	if (response.status === "loading")
		return (<Loading />);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);
	if (!response.data)
		return null
	if (!response.data[0])
		return <div className="m-4">No channels to join</div>

	function changeMap(chanName: string, pw: string) {
		let temp: Map<string, string> = new Map(inputPw);
		temp.set(chanName, pw);
		setInputPw(temp);
	}
	
	return (				 
		<ul className="m-5 w-full h-full flex flex-col justify-start overflow-y-scroll">
			{response.data.map(( chan ) => {				
				return (
					<li className="flex justify-between w-full px-2 items-center my-1" key={chan.name}>
						<div className=" w-full flex- flex-col">
							<p className="text-lg">#{chan.name}</p>
							<div className="flex flex-row justify-between">
								<input value={inputPw.get(chan.name)} type="password" className={`input ${chan.mode === ChanMode.PROTECTED ? 'bg-white' : 'bg-gray-100'} text-inherit text-black w-64 h-12`} disabled={chan.mode !== ChanMode.PROTECTED} placeholder="Password" onChange={(e) => changeMap(chan.name, e.target.value)}/>
								<JoinButton channelName={chan.name} mode={chan.mode} password={inputPw.get(chan.name)!} />
							</div>
						</div>
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
					<TravelExplore sx={{ width: 64, height: 64 }}/>
				</button>
				<button className="tooltip btn btn-neutral h-1/3 w-1/3 m-5" data-tip="Create Channel" onClick={() => setActivePopUp("create")}>
					<AddCircleOutline sx={{ width: 64, height: 64 }}/>
				</button>
				{
					activePopUp !== "" &&
						<PopUp close={() => setActivePopUp("")}>
							{activePopUp === "create" ? <Create /> : <Explore />}
						</PopUp>
				}
			</div>
		</>
	)
}