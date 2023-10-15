import { FormEvent, useContext, useEffect, useState } from "react";
import { SocketChatContext } from "../../utils/Context";
import { logSuccess, logWarn } from "../../chat/Chat";

interface InviteButtonProps {
	chan: string,
}

// Invite is different than other Button
/// Upgrade Degrade Kick and Ban are identique
export function InviteModule({chan}: InviteButtonProps) {
	
	const [guestUsername, setGuest]: [string, Function] = useState("")
	const socket = useContext(SocketChatContext);

	useEffect(() => {
		function inviteResListener(result: any) {
			if (result.status === "OK")
				logSuccess(result.description);
			else
				logWarn(result.description);
		};
		socket!.on('inviteRes', inviteResListener);
		return () => {socket!.off('inviteRes', inviteResListener);};
	}, [socket])

	function invite(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!guestUsername)
			return ;
		socket!.emit('invite',chan, guestUsername);
		setGuest('');
	};

	return (
		<form className="flex flex-col justify-start items-center"onSubmit={invite}>
			<p className="font-bold text-lg">Invitation</p>
			<div className="flex w-full flex-col items-center justify-center">
				<input className="input w-9/12 h-8 bg-neutral-100 m-2" value={guestUsername} placeholder="Username" onChange={(e) => {setGuest(e.currentTarget.value);}} />
				<button className="btn w-10/12 h-12 send-button text-white" type="submit">INVITE</button>
			</div>
		</form>
	);
}