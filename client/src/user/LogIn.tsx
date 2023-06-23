

import { useSearchParams } from "react-router-dom";
import { client_url, server_url } from "../utils/request";

export default function LogIn() {
	const [searchParams] = useSearchParams();
	const tokenParam = searchParams.get("token");
	if (tokenParam)
	{
		localStorage.setItem("token", tokenParam);
		window.location.replace(client_url);
		return (<strong>redirection...</strong>);
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
