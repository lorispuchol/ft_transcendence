import { useEffect, useState } from "react";
import { ChanMode, ChannelData } from "../../chat/interfaceData";
import { GetRequest } from "../../utils/Request";
import Loading from "../../utils/Loading";
import ErrorHandling from "../../utils/Error";
import { FormControl, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup } from "@mui/material";
import { Add } from "@mui/icons-material";

interface ChangeAccessibilityProps {
	chanName: string,
}

interface Response {
	status: string | number,
	data?: ChannelData[],
	error?: string,
}

export function ChangeAccessibility({chanName}: ChangeAccessibilityProps) {
	
	const [response, setResponse]: [Response, Function] = useState({status: "loading"});

	useEffect(() => {
		GetRequest("/chat/getConvs").then((response) => setResponse(response));
	}, []);
	if (response.status === "loading")
		return (<Loading />);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);

	const channel: ChannelData | undefined = response.data!.find((conv) => conv.name === chanName);

	const [datasAccess, setDatasAccess] = useState({
		mode: ChanMode.PUBLIC,
		currentPw: "",
		newPw: "",
	});

	if (!channel)
		return null;

	const changeMode = (event: React.ChangeEvent<HTMLInputElement>) => {
		setDatasAccess({
			...datasAccess,
			mode: event.target.value as ChanMode,
		});
	};

	const changeCurrentPw = (event: React.ChangeEvent<HTMLInputElement>) => {
		setDatasAccess({
			...datasAccess,
			currentPw: event.target.value,
		});
	};

	const changeNewPw = (event: React.ChangeEvent<HTMLInputElement>) => {
		setDatasAccess({
			...datasAccess,
			newPw: event.target.value,
		});
	};

	function submitAccess(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		/*
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
		*/
		console.log(datasAccess.currentPw, datasAccess.newPw, datasAccess.mode)
	}

	return (
		<div>
			<FormControl className="flex flex-col items-center">
				<FormLabel className=" text-inherit mb-3 text-base font-semibold">CREATE YOUR OWN CHANNEL</FormLabel>
				<form onSubmit={submitAccess}>
					<FormGroup>
						<input className="input w-full max-w-xs bg-white mb-3 text-inherit text-black" value={datasAccess.currentPw} onChange={changeCurrentPw} name="name" placeholder="Channel Name" />	
						<input className="input w-full max-w-xs bg-white mb-3 text-inherit text-black" disabled={datasAccess.mode !== ChanMode.PROTECTED} type="password" placeholder="Password" value={datasAccess.newPw} onChange={changeNewPw} name="password" />	
					</FormGroup>
					<RadioGroup
						className="mb-3"
						onChange={changeMode}
						value={datasAccess.mode}
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