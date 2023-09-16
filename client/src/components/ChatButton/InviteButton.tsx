import { logError, logSuccess, logWarn } from "../../chat/Chat";
import { MemberDistinc, ParticipantData } from "../../chat/interfaceData";
import { PostRequest } from "../../utils/Request";

interface InviteMemberButtonProps {
	memberPart: ParticipantData,
}

export function InviteButton({ memberPart }: InviteMemberButtonProps) {
	
	const login = memberPart.user.login;

	function invite() {
		PostRequest("/chat/setDistinction/" + memberPart.channel.name, {login: login, distinction: MemberDistinc.INVITED}).then((response: any) => {
			if (response.status === "OK") {
				if (response.data.status === "KO")
					logWarn(response.data.description)
				else
					logSuccess(response.data.description)
			}
			else
				logError(response.error)
		});
	}
	return (
		<button onClick={invite}>INVITE</button>
	);
}