import { useContext } from "react";
import { MemberDistinc, ParticipantData } from "../../chat/interfaceData";
import { PostRequest } from "../../utils/Request";
import { logError, logSuccess, logWarn } from "../../chat/Chat";
import { RerenderListContext, SetDisplayMemberContext, SetRerenderListContext } from "../../utils/Context";

interface ControlButtonProps {
	memberPart: ParticipantData,
	distinction: MemberDistinc,
}

// Invite is different than other Button
/// Upgrade Degrade Kick and Ban are identique
export function ControlButton({ memberPart, distinction }: ControlButtonProps) {
	
	const login = memberPart.user.login;
	const setDisplayMember: Function = useContext(SetDisplayMemberContext);
	const setRr: Function = useContext(SetRerenderListContext);
	const rr: number = useContext(RerenderListContext);

	function changeDistinction() {
		PostRequest("/chat/setDistinction/" + memberPart.channel.name, {login: login, distinction: distinction}).then((response: any) => {
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
		<button className="btn" onClick={changeDistinction}>
			{distinction === MemberDistinc.BANNED && <p>BAN</p>}
			{distinction === MemberDistinc.KICK && <p>KICK</p>}
			{distinction === MemberDistinc.MEMBER && <p>DEGRADE AS MEMBER</p>}
			{distinction === MemberDistinc.ADMIN && <p>UPGRADE AS ADMIN</p>}
		</button>
	);
}