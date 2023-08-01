import { Navigate, useParams } from "react-router-dom";
import { GetRequest } from "../../utils/Request";
import { useEffect, useState } from "react";
import ErrorHandling from "../../utils/Error";
import NoRouteFound from "../Error/NoRouteFound";
import Loading from "../../utils/Loading";

import './Profile.scss'
import { Paper } from "@mui/material";

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
			<div className='profile_top items-center grid grid-cols-3'>
				<Paper><img className='profile_image' src={profile.avatar} alt={profile.username + " pp"} /></Paper>
				<Paper className='col-span-2 profile_username'>{profile.username}</Paper>
			</div>
			<Paper className='grid grid-cols-6 profile_score'>
				<div className='flex col-span-2 victory'>VICTORY</div>
				<div className='flex score'>{profile.nb_victory}</div>
				<div className='flex col-span-2 defeat'>DEFEAT</div>
				<div className='flex score'>{profile.nb_defeat}</div>
			</Paper>
			<Paper className='profile_mh'>
				<div className='profile_mh_header'>MATCH HISTORY</div>
				<div className='grid grid-cols-7'>
					<div className='profile_mh_score col-span-2'>DOMICILE</div>
					<div className='profile_mh_score'>0</div>
					<div className='profile_mh_score'>VS</div>
					<div className='profile_mh_score'>0</div>
					<div className='profile_mh_score col-span-2'>EXTERIEUR</div>
				</div>
				<div className='grid grid-cols-7'>
					<div className='profile_mh_score col-span-2'>DOMICILE</div>
					<div className='profile_mh_score'>0</div>
					<div className='profile_mh_score'>VS</div>
					<div className='profile_mh_score'>0</div>
					<div className='profile_mh_score col-span-2'>EXTERIEUR</div>
				</div>
				<div className='grid grid-cols-7'>
					<div className='profile_mh_score col-span-2'>DOMICILE</div>
					<div className='profile_mh_score'>0</div>
					<div className='profile_mh_score'>VS</div>
					<div className='profile_mh_score'>0</div>
					<div className='profile_mh_score col-span-2'>EXTERIEUR</div>
				</div>
				<div className='grid grid-cols-7'>
					<div className='profile_mh_score col-span-2'>DOMICILE</div>
					<div className='profile_mh_score'>0</div>
					<div className='profile_mh_score'>VS</div>
					<div className='profile_mh_score'>0</div>
					<div className='profile_mh_score col-span-2'>EXTERIEUR</div>
				</div>
				<div className='grid grid-cols-7'>
					<div className='profile_mh_score col-span-2'>DOMICILE</div>
					<div className='profile_mh_score'>0</div>
					<div className='profile_mh_score'>VS</div>
					<div className='profile_mh_score'>0</div>
					<div className='profile_mh_score col-span-2'>EXTERIEUR</div>
				</div>
			</Paper>
		</div>
	);
}
