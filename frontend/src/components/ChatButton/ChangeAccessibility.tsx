import { useEffect, useState } from "react";
import { ChanMode, ChannelData } from "../../chat/interfaceData";
import { FormControl, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup } from "@mui/material";

interface ChangeAccessibilityProps {
	channel: ChannelData,
	newMode: ChanMode,
}

export function ChangeAccessibility({channel, newMode}: ChangeAccessibilityProps) {
	
	const [datasAccess, setDatasAccess] = useState({
		mode: newMode,
		currentPw: "",
		newPw: "",
	});

	useEffect(() => {
		setDatasAccess({mode: newMode, currentPw: "", newPw: ""});
	}, [newMode])

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
				<FormLabel className="text-inherit mb-3 text-base">Change Accessiblity</FormLabel>
				<form onSubmit={submitAccess}>
					<RadioGroup
						className="mb-3"
						onChange={changeMode}
						value={datasAccess.mode}
						aria-labelledby="demo-radio-buttons-group-label"
						defaultValue="public"
						name="radio-buttons-group"
					>
						{channel.mode !== ChanMode.PUBLIC && <FormControlLabel value={ChanMode.PUBLIC} control={<Radio color="default"/>} label="Public" />}
						{channel.mode !== ChanMode.PRIVATE && <FormControlLabel value={ChanMode.PRIVATE} control={<Radio color="default"/>} label="Private" />}
						<FormControlLabel value={ChanMode.PROTECTED} control={<Radio color="default"/>} label={channel.mode === ChanMode.PROTECTED ? "Change Password" : "Protected"} />
					</RadioGroup>
					<FormGroup>
						{channel.mode === ChanMode.PROTECTED && <input className="input w-full h-10 max-w-xs bg-white mb-3 text-inherit text-black" value={datasAccess.currentPw} type="password" onChange={changeCurrentPw} name="name" placeholder="Current Password" />}
						{datasAccess.mode === ChanMode.PROTECTED && <input className="input w-full h-10 max-w-xs bg-white mb-3 text-inherit text-black" value={datasAccess.newPw} type="password" onChange={changeNewPw} name="password" placeholder="New Password" disabled={datasAccess.mode !== ChanMode.PROTECTED} />}
					</FormGroup>
					<button className="w-full btn btn-active h-14 text-slate-200 bg-purple-700 btn-neutral hover:bg-purple-900" type="submit" >CHANGE ACCESSIBILITY</button>
				</form>
			</FormControl>
		</div>
	  );
}