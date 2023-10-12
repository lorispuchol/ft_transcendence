import { useParams } from "react-router-dom";
import { GetRequest } from "../../utils/Request";
import { useContext, useEffect, useState } from "react";
import ErrorHandling from "../../utils/Error";
import NoRouteFound from "../Error/NoRouteFound";
import Loading from "../../utils/Loading";
import UserStatus from "../../user/UserStatus";
import { IoSettingsSharp } from 'react-icons/io5'
import defaultPp from './default.png';
import './Profile.scss'
import { Avatar, Paper } from "@mui/material";

import SettingsPopup from "./SettingsPopup";
import { UserContext } from "../../utils/Context";

interface UserData {
	id: number,
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

export const defaultAvatar: string = defaultPp;

export default function Profile() {
	const [show, setShow] = useState(false);
	const handleShow = () => setShow(true);
	const closeSettings = () =>setShow(false);

	const me = useContext(UserContext);
	const param = useParams();
	
	const [response, setResponse]: [Response, Function] = useState({status: "loading"});
	useEffect(() => {
		GetRequest("/user/profile/username/" + param.username).then((response) => setResponse(response));
	}, [param.username]);
	if (response.status === "loading")
		return (<Loading />);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);
	if (!response.data?.username)
		return (<NoRouteFound />)
	const profile = {
		id: response.data.id,
		avatar: response.data.avatar? response.data.avatar : defaultAvatar,
		login: response.data.login,
		username: response.data.username,
		nb_victory: response.data.nb_victory,
		nb_defeat: response.data.nb_defeat,
	}

	return (
		<div className="profile_page">
			<div className='profile_top items-center grid grid-cols-3 py-4 px-4 relative flex flex-wrap'>
				<Avatar className='profile_image' alt={profile.username + " pp"} src={profile.avatar} sx={{ width: 256, height: 256 }}/>
<<<<<<< HEAD:client/src/pages/Profile/Profile.tsx
				<Paper className='profile_username col-span-2 flex'><div className="pr-3">{profile.username}</div><UserStatus login={profile.login} /></Paper>
				{profile.username === me && <button className="absolute top-0 end-0 pt-4 pr-4" onClick={handleShow}><IoSettingsSharp size={32}/></button>}
=======
				<Paper className='profile_username col-span-2 flex'><div className="pr-3">{profile.username}</div><UserStatus userId={profile.id} /></Paper>
				<button className="absolute top-0 end-0 pt-4 pr-4" onClick={handleShow}><IoSettingsSharp size={32}/></button>
>>>>>>> 36e6b437bd15ec4df1b0fdc464ad933171f3960a:frontend/src/pages/Profile/Profile.tsx
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
			{show &&
				<SettingsPopup close={closeSettings}/>
			}
		</div>
	)
}
