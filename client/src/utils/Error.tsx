import { Navigate } from "react-router-dom";
import { client_url } from "./Request";

export default function ErrorHandling(params: any)
{
	if (params.status === 401)
		window.location.replace(client_url);
	return (
		<>
			<strong>{params.status + ": " + params.message}</strong>
		</>
	);
}
