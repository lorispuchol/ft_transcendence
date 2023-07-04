import { Navigate, useParams } from "react-router-dom";
import { GetRequest } from "../utils/Request";
import { useEffect, useState } from "react";
import ErrorHandling from "../utils/Error";
import NoRouteFound from "../pages/Error/NoRouteFound";
import Loading from "../utils/Loading";

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

export const defaultAvatar = "https://cdn.intra.42.fr/users/292c41c82eeb97e81e28e35d25405eb8/kmammeri.jpg";

export default function Profile() {
	const param = useParams();

	const [response, setResponse]: [any, any] = useState({status: "loading"});
	useEffect(() => {
			GetRequest("/user/" + param.username).then((response) => setResponse(response));
	}, []);
	if (response.status === "loading")
		return (<Loading />);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);
	if (!response.data.username)
		return (<NoRouteFound />)
	const profile = {
		avatar: response.data.avatar? response.data.avatar : defaultAvatar,
		login: response.data.login,
		username: response.data.username,
		nb_victory: response.data.nb_victory,
		nb_defeat: response.data.nb_defeat,
	}
	return (
		<>
			<img className="profile_avatar" src={profile.avatar} alt={profile.username + " pp"} />
			<ul>
				<li>login: {profile.login}</li>
				<li>username: {profile.username}</li>
				<li>nb_victory: {profile.nb_victory}</li>
				<li>nb_defeat: {profile.nb_defeat}</li>
			</ul>
		</>
	);
}
