import { useEffect, useState } from "react";
import { GetRequest } from "../utils/Request";
import Loading from "../utils/Loading";
import ErrorHandling from "../utils/Error";

export default function Everyone()
{
	const [response, setResponse]: [any, any] = useState({status: "loading"});
	useEffect(() => {
			GetRequest("/user/all").then((response) => setResponse(response));
	}, []);
	if (response.status === "loading")
		return (<Loading />);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);
	
	const users = response.data;
	return (
		<>
			<ul>
				{users.map((user: any) => (
					<li key={user.id} >{user.login}</li>
				))}
			</ul>
		</>
	);
}
