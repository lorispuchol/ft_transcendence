import { useContext, useState } from "react";
import { SocketChatContext } from "../../utils/Context";

interface InviteButtonProps {
	chan: string,
}

export function InviteModule({chan}: InviteButtonProps) {
	
	const [guestUsername, setGuest]: [string, Function] = useState("")
	const socket = useContext(SocketChatContext);

	function invite() {
		socket!.emit('invite',chan, guestUsername);
		setGuest('');
	};

	return (
		<div>
			<input value={guestUsername} placeholder="Username" onChange={(e) => {setGuest(e.currentTarget.value);}} />
			<button className="btn" onClick={invite}>INVITE</button>
		</div>
	);
}