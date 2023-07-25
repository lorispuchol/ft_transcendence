import { Navigate, useParams } from "react-router-dom";
import { GetRequest } from "../../utils/Request";
import { useEffect, useState } from "react";
import ErrorHandling from "../../utils/Error";
import NoRouteFound from "../Error/NoRouteFound";
import Loading from "../../utils/Loading";

import './Profile.scss'

interface UserData {
	avatar: string,
	login: string,
	username: string,
	nb_victory: number,
	nb_defeat: number,
}

interface Response {
	status: string,
	data?: UserData,
	error?: string,
}

export function RedirectToOwnProfile() {
	const [response, setResponse]: [Response, Function] = useState({status: "loading"});
	useEffect(() => {
			GetRequest("/user/me").then((response) => setResponse(response));
	}, []);
	if (response.status === "loading")
		return (<Loading />);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);
	return (<Navigate to={"/profile/" + response.data?.username} />);
}

export const defaultAvatar = "https://cdn.intra.42.fr/users/292c41c82eeb97e81e28e35d25405eb8/kmammeri.jpg";

export default function Profile() {
	const param = useParams();

	const [response, setResponse]: [Response, Function] = useState({status: "loading"});
	useEffect(() => {
			GetRequest("/user/" + param.username).then((response) => setResponse(response));
	}, [param.username]);
	if (response.status === "loading")
		return (<Loading />);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);
	if (!response.data?.username)
		return (<NoRouteFound />)
	const profile = {
		avatar: response.data.avatar? response.data.avatar : defaultAvatar,
		login: response.data.login,
		username: response.data.username,
		nb_victory: response.data.nb_victory,
		nb_defeat: response.data.nb_defeat,
	}
	return (
		<div>
			<div className='flex flex-wrap profile_top items-center justify-between'>
				<img className='profile_image' src={profile.avatar} alt={profile.username + " pp"} />
				<div className='flex profile_username'>{profile.username}</div>
			</div>
			<ul>
				<li>login: {profile.login}</li>
				<li>username: {profile.username}</li>
				<li>nb_victory: {profile.nb_victory}</li>
				<li>nb_defeat: {profile.nb_defeat}</li>
			</ul>
		</div>
	);
}
