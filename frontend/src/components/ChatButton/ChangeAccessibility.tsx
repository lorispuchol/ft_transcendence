import { useEffect, useState } from "react";
import { ChanMode, ChannelData } from "../../chat/interfaceData";
import { FormControl, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup } from "@mui/material";
import { PostRequest } from "../../utils/Request";
import { logError, logSuccess, logWarn } from "../../chat/Chat";

interface ChangeAccessibilityProps {
	channel: ChannelData,
	newMode: ChanMode,
	reRenderList: number,
	setRerenderList: Function
}

export function ChangeAccessibility({channel, newMode, reRenderList, setRerenderList}: ChangeAccessibilityProps) {
	
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

		const channelName = channel.name;
		const mode = datasAccess.mode;
		const password = datasAccess.currentPw;
		const newPw = datasAccess.newPw;

		if (datasAccess.mode === ChanMode.PROTECTED) {
			if (channel.mode === ChanMode.PROTECTED) {
				PostRequest("/chat/changePwChan/" + channel.name, {channelName, password, newPw}).then((response: any) => {
					if (response.status === "OK"){
						if (response.data.status === "KO")
							logWarn(response.data.description)
						else {
							logSuccess(response.data.description)
							setDatasAccess({mode: ChanMode.PUBLIC, currentPw: "", newPw: ""});
							setRerenderList(reRenderList + 1);
						}
					}
					else
						logError(response.error);
				});
			}
			else {
				PostRequest("/chat/addPwChan/" + channel.name, { newPw }).then((response: any) => {
					if (response.status === "OK"){
						if (response.data.status === "KO")
							logWarn(response.data.description)
						else {
							logSuccess(response.data.description)
							setDatasAccess({mode: ChanMode.PUBLIC, currentPw: "", newPw: ""});
							setRerenderList(reRenderList + 1);
						}
					}
					else
						logError(response.error);
				});
			}
		}
		else {
			if (channel.mode === ChanMode.PROTECTED) {
				PostRequest("/chat/removePwChan/" + channel.name, {channelName, password, mode}).then((response: any) => {
					if (response.status === "OK"){
						if (response.data.status === "KO")
							logWarn(response.data.description)
						else {
							logSuccess(response.data.description)
							if (mode === ChanMode.PUBLIC)
								setDatasAccess({mode: ChanMode.PRIVATE, currentPw: "", newPw: ""});
							else if (mode === ChanMode.PRIVATE)
								setDatasAccess({mode: ChanMode.PUBLIC, currentPw: "", newPw: ""});
							setRerenderList(reRenderList + 1);
						}
					}
					else
						logError(response.error);
				});
			}
			else {
				PostRequest("/chat/changeModeChan/" + channel.name, { mode }).then((response: any) => {
					if (response.status === "OK"){
						if (response.data.status === "KO")
							logWarn(response.data.description)
						else {
							logSuccess(response.data.description)
							if (mode === ChanMode.PUBLIC)
								setDatasAccess({mode: ChanMode.PRIVATE, currentPw: "", newPw: ""});
							else if (mode === ChanMode.PRIVATE)
								setDatasAccess({mode: ChanMode.PUBLIC, currentPw: "", newPw: ""});
							setRerenderList(reRenderList + 1);
						}
					}
					else
						logError(response.error);
				});
			}
		}
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