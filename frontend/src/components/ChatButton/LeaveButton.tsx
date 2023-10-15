import { GetRequest } from "../../utils/Request";
import { logError, logSuccess, logWarn } from "../../chat/Chat";
import { useNavigate } from "react-router-dom";
import { Logout } from "@mui/icons-material";

interface LeaveButtonProps {
	chanName: string,
}

// Leave is different than other Button
/// Upgrade Degrade Kick and Ban are identique
export function LeaveButton({ chanName }: LeaveButtonProps) {

	const navigate = useNavigate();

	function leave() {
		GetRequest("/chat/leaveChan/" + chanName).then((response: any) => {
			if (response.status === "OK") {
				if (response.data.status === "KO") {
					logWarn(response.data.description)
					navigate("/chat", {replace: true, state: {to: null}})
				}
				else {
					logSuccess(response.data.description)
					navigate("/chat", {replace: true, state: {to: null}})
				}
			}
			else {
				logError(response.error)
				navigate("/chat", {replace: true, state: {to: null}})
			}
		});
	}
	return (
		<button className="h-12 w-10/12 text-white btn leave-button" onClick={leave}>
			<p>LEAVE </p>
			<Logout />
		</button>
	);
}