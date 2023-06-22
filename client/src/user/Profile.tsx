import { Navigate, useParams } from "react-router-dom";
import { GetRequest } from "../utils/request";
import { useEffect, useState } from "react";
import ErrorHandling from "../utils/error";

export function RedirectToOwnProfile() {
	const [data, setData]: [any, any] = useState([]);
	useEffect(() => {
			GetRequest("/user/me").then((response) => setData(response));
	}, []);
	if (data.status !== "OK")
		return (<ErrorHandling status={data.status} message={data.error} />);
	return (<Navigate to={"/profile/" + data.username} />)
}

export default function Profile() {
	const params = useParams();
	return (
		<>
			{params.username} profile
		</>
	);
}
