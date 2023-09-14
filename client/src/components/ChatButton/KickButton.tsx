import { useContext } from "react";
import { ParticipantData } from "../../chat/interfaceData";
import { PostRequest } from "../../utils/Request";
import { logError, logSuccess, logWarn } from "../../chat/Chat";
import { RerenderListContext, SetDisplayMemberContext, SetRerenderListContext } from "../../utils/Context";

interface KickButtonProps {
	disabled: boolean,
	activeUserPart: ParticipantData,
	memberPart: ParticipantData,
}

export default function KickButton({ disabled, activeUserPart, memberPart }: KickButtonProps) {
	
	const kickedlogin = memberPart.user.login;
	const setDisplayMember: Function = useContext(SetDisplayMemberContext);
	const setRr: Function = useContext(SetRerenderListContext);
	const rr: number = useContext(RerenderListContext);

	function kick() {
		PostRequest("/chat/kick/" + memberPart.channel.name, {kickedlogin: kickedlogin}).then((response: any) => {
			if (response.status === "OK") {
				if (response.data.status === "KO")
					logWarn(response.data.description)
				else {
					logSuccess(response.data.description)
					setDisplayMember(null);
					setRr(rr + 1)
					console.log(activeUserPart.channel.name)
				}
				
			}
			else
				logError(response.error)
		});
	}

	return (
		<button disabled={disabled} onClick={kick}>KICK</button>
	);
}
