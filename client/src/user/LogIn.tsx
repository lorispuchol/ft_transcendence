

import { Navigate, useSearchParams } from "react-router-dom";
import { server_url } from "../utils/request";

export default function LogIn() {
	const [searchParams] = useSearchParams();
	const tokenParam = searchParams.get("token");
	if (tokenParam)
	{
		localStorage.setItem("token", tokenParam);
		return (<Navigate to='/' />);
	}

	return (
		<>
			login
			<button>
				<a href={server_url + "/auth/"} >log in</a>
			</button>
		</>
	);
}
