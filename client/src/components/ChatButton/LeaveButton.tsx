import { useContext } from "react";
import { GetRequest } from "../../utils/Request";
import { logError, logSuccess, logWarn } from "../../chat/Chat";
import { RerenderListContext, SetDisplayMemberContext, SetRerenderListContext } from "../../utils/Context";
import { useNavigate } from "react-router-dom";

interface LeaveButtonProps {
	chanName: string,
}

// Leave is different than other Button
/// Upgrade Degrade Kick and Ban are identique
export function LeaveButton({ chanName }: LeaveButtonProps) {
	
	const setDisplayMember: Function = useContext(SetDisplayMemberContext);
	const setRr: Function = useContext(SetRerenderListContext);
	const rr: number = useContext(RerenderListContext);

	const navigate = useNavigate();

	function leave() {
		GetRequest("/chat/leaveChan/" + chanName).then((response: any) => {
			if (response.status === "OK") {
				if (response.data.status === "KO") {
					logWarn(response.data.description)
					// navigate("/chat", {replace: true, state: {to: null}})
				}
				else {
					logSuccess(response.data.description)
					navigate("/chat", {replace: true, state: {to: null}})
					// setDisplayMember(null);
					// setRr(rr + 1)
				}
			}
			else {
				logError(response.error)
				// navigate("/chat", {replace: true, state: {to: null}})
			}
		});
	}
	return (
		<button className="btn btn-secondary" onClick={leave}>
			<p>LEAVE</p>
		</button>
	);
}