import { Navigate } from "react-router-dom";

export default function ErrorHandling(params: any)
{
	if (params.status === 401)
		return (<Navigate to="/login" />)
	return (
		<>
			<strong>{params.status + ": " + params.message}</strong>
		</>
	);
}
