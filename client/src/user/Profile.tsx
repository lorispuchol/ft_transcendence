import { Navigate, useParams } from "react-router-dom";
import { GetRequest } from "../utils/request";
import { useEffect, useState } from "react";
import ErrorHandling from "../utils/error";
import Loading from "../utils/loading";

export function RedirectToOwnProfile() {
	const [response, setResponse]: [any, any] = useState({status: "loading"});
	useEffect(() => {
			GetRequest("/user/me").then((response) => setResponse(response));
	}, []);
	if (response.status === "loading")
		return (<Loading />);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);
	return (<Navigate to={"/profile/" + response.data.username} />)
}

export default function Profile() {
	const params = useParams();

	const [response, setResponse]: [any, any] = useState({status: "loading"});
	useEffect(() => {
			GetRequest("/user/me").then((response) => setResponse(response));
	}, []);
	if (response.status === "loading")
		return (<Loading />);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);

	console.log(response.data);
	const profile = {
		avatar: response.data.avatar? response.data.avatar : "https://cdn.intra.42.fr/users/292c41c82eeb97e81e28e35d25405eb8/kmammeri.jpg",
		login: response.data.login,
		username: response.data.username,
		nb_victory: response.data.nb_victory,
		nb_defeat: response.data.nb_defeat,
	}
	return (
		<>
			<img className="avatar" src={profile.avatar} alt={profile.username + " pp"} />
			<ul>
				<li>login: {profile.login}</li>
				<li>username: {profile.username}</li>
				<li>nb_victory: {profile.nb_victory}</li>
				<li>nb_defeat: {profile.nb_defeat}</li>
			</ul>
		</>
	);
}
