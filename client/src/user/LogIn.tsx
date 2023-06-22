
import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { GetRequest, server_url } from "../utils/request";
import ErrorHandling from "../utils/error";

export default function LogIn() {
	const [searchParams] = useSearchParams();
	const tokenParam = searchParams.get("token");
	if (tokenParam)
		localStorage.setItem("token", tokenParam);
	
	const [data, setData]: [any, any] = useState([]);
	useEffect(() => {
			GetRequest("/auth/ping").then((response) => setData(response));
	}, []);
	
	if (data.status === 401)
		return (
				<>
					login
					<button>
						<a href={server_url + "/auth/"} >log in</a>
					</button>
				</>
			);
	if (data.status !== "OK")
		return (<ErrorHandling status={data.status} message={data.error} />);
	return (<Navigate to='/' />);
}
