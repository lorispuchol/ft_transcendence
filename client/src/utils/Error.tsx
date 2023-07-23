import { client_url } from "./Request";

interface Error {
	status: string | number,
	message?: string,
}

export default function ErrorHandling(params: Error)
{
	if (params.status === 401)
		window.location.replace(client_url);
	return (
		<>
			<strong>{params.status + ": " + params.message}</strong>
		</>
	);
}
