import { useContext } from "react";
import { MemberDistinc, ParticipantData } from "../../chat/interfaceData";
import { PostRequest } from "../../utils/Request";
import { logError, logSuccess, logWarn } from "../../chat/Chat";
import { RerenderListContext, SetDisplayMemberContext, SetRerenderListContext } from "../../utils/Context";
import dayjs from "dayjs";

interface MuteButtonProps {
	memberPart: ParticipantData,
}

// Mute is different than other Button
/// Upgrade Degrade Kick and Ban are identique
export function MuteButton({ memberPart}: MuteButtonProps) {
	
	const login = memberPart.user.login;
	const setDisplayMember: Function = useContext(SetDisplayMemberContext);
	const setRr: Function = useContext(SetRerenderListContext);
	const rr: number = useContext(RerenderListContext);
	// const isMute: boolean = memberPart.mut
	var ne = dayjs();
	console.log(ne);


	function mute() {
		PostRequest("/chat/mute/" + memberPart.channel.name, {login: login}).then((response: any) => {
			if (response.status === "OK") {
				if (response.data.status === "KO")
					logWarn(response.data.description)
				else {
					logSuccess(response.data.description)
					setDisplayMember(null);
					setRr(rr + 1)
				}
			}
			else
				logError(response.error)
		});
	}
	return (
		<button onClick={mute}>
			<p>MUTE</p>
		</button>
	);
}