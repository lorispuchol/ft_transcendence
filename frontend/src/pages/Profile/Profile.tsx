import { useParams } from "react-router-dom";
import { GetRequest, client_url } from "../../utils/Request";
import { useContext, useEffect, useState } from "react";
import ErrorHandling from "../../utils/Error";
import NoRouteFound from "../Error/NoRouteFound";
import Loading from "../../utils/Loading";
import { IoSettingsSharp } from 'react-icons/io5'
import defaultPp from './default.png';
import './Profile.scss'
import ProfileImg from "../../components/Profile/ProfileImg";

import SettingsPopup from "./SettingsPopup";
import { UserContext } from "../../utils/Context";
import { IconButton, Paper } from "@mui/material";
import MatchHistory from "../../components/Profile/MatchHistory";
import { Logout } from "@mui/icons-material";
import FriendList from "../../components/Profile/FriendList";
import Friendbutton from "../../components/Relationship/Friendbutton";
import MessageButton from "../../chat/MessageButton";

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
	const closeSettings = () => setShow(false);

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

	function disconnect() {
		localStorage.clear();
		window.location.replace(client_url);
	}

	return (
		<div className="profile_page">
			<div className='profile_top items-center grid grid-cols-3 py-4 px-4 relative flex'>
				<div className="profile_image"><ProfileImg userId={profile.id} userAvatar={profile.avatar}/></div>
				<Paper className='profile_username col-span-2 flex'><div>{profile.username}</div></Paper>
				{profile.username === me && 
				<div className="absolute top-0 end-0 flex items-center">
					<IoSettingsSharp onClick={handleShow} className="mr-4 hover:cursor-pointer" size={32}/>
					<div><Paper className="!w-min"><IconButton onClick={disconnect}><Logout color="error"/></IconButton></Paper></div>
					</div>}
				{profile.username !== me &&
				<div className="absolute top-0 end-0 flex items-center"><Friendbutton id={profile.id} />
				<div className="message_button"><MessageButton receiverId={profile.id}/></div></div>}
			</div>
			<Paper className='grid grid-cols-6 profile_score'>
				<div className='col-span-2 victory_p'>VICTORY</div>
				<div className='score_p'>{profile.nb_victory}</div>
				<div className='col-span-2 defeat_p'>DEFEAT</div>
				<div className='score_p'>{profile.nb_defeat}</div>
			</Paper>
			<MatchHistory ProfileId={profile.id} />
			<FriendList userId={profile.id} />
			{show &&
				<SettingsPopup close={closeSettings} login={profile.login}/>
			}
		</div>
	)
}
