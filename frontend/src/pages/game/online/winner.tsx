import { useEffect, useState } from "react";
import { GetRequest } from "../../../utils/Request";


export default function DisplayWinner({ winnerId }: { winnerId: number }) {
	const [winner, setWinner]: [string, Function] = useState("");
	
	useEffect(() => {
		if (winnerId === -1)
			return ;
		GetRequest("/user/profile/id/" + winnerId).then((response: any) => {
			if (response.data)
				setWinner(response.data.username);
			else
				setWinner("user not found");
		})
	}, [winnerId, setWinner])

	if (winnerId === -1)
		return (<></>);
	return (
			<h1 className="get_ready top-[20vw]">{winner + " win"}</h1>
	);
}
