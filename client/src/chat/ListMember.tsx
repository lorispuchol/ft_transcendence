import { useContext, useEffect, useState } from "react";
import { GetRequest } from "../utils/Request";
import ErrorHandling from "../utils/Error";
import Loading from "../utils/Loading";
import { ParticipantData, UserData } from "./interfaceData";
import { defaultAvatar } from "../pages/Profile/Profile";
import { Avatar, Paper } from "@mui/material";
import UserStatus from "../user/UserStatus";
import { NavLink } from "react-router-dom";
import GamingButton from "../components/game/GamingButton";
import MessageButton from "./MessageButton";
import Friendbutton from "../components/Relationship/Friendbutton";
import BlockButton from "../components/Relationship/BlockButton";
import { logInfo } from "./Chat";
import { UserContext } from "../utils/Context";
import './chat.scss'
import '../user/user.scss'
import { ArrowForward } from "@mui/icons-material";

interface MemberProps {
	user: UserData,
	setDisplayProfile: Function,
}
interface ResponseMembers {
	status: string | number,
	data?: ParticipantData[],
	error?: string,
}

interface ProfileProps {
	user: UserData,
	isDm: boolean,
}
interface ListMembersProps {
	chan: string
}

function log(message: string) {
	logInfo(message);
}

function Profile({ user, isDm}: ProfileProps) {

	const avatar: any = user.avatar ? user.avatar : defaultAvatar;

	return (
		<div className="flex flex-col items-center my-3">
			<div className="relative m-2">
				<div className=""><Avatar sx={{ width: 128, height: 128 }} src={avatar} alt={user.username}/></div>
				<div className="absolute top-[100px] left-[100px]"><UserStatus login={user.login} /></div>
			</div>
			<div className="tooltip tooltip-bottom" data-tip="go to profile"> 
				<NavLink to={'/profile/' + user.login}>
					<Paper className="everyone_username">{user.username}</Paper>
				</NavLink>
			</div>
			<div className="button_group flex flex-row items-center justify-center">
				{!isDm && <div className="message_button"><MessageButton receiver={user.login}/></div>}
				<div className="friend_button"><Friendbutton login={user.login} render={log} /></div>
				<div className="block_button"><BlockButton login={user.login} render={log} /></div>
			</div>
			<div className="gaming_button"><GamingButton login={user.login}/></div>
		</div>
	)
}

function Member({ user, setDisplayProfile }: MemberProps) {

	return (
		<div className="profile-module">
			<button className= "" onClick={() => setDisplayProfile(null)}><ArrowForward /></button>
			<Profile user={user} isDm={false} />
		</div>
	)
}

function MemberButton({ user, setDisplayProfile}: MemberProps) {
	
	const avatar: any = user.avatar ? user.avatar : defaultAvatar;

	return (
		<button onClick={() => setDisplayProfile(user)} className="w-full flex flex-row flex-nowrap items-center member-button py-2 px-1">
			<div className="relative mx-2">
				<div className=""><Avatar src={avatar} alt={user.username}/></div>
				<div className="absolute top-5 left-7"><UserStatus login={user.login} /></div>
			</div>
			<p className="ml-3 mr-2 text-ellipsis overflow-hidden text-white">{user.username}</p>
		</button>
	)
}

export default function ListMembers({chan}: ListMembersProps) {

	const user = useContext(UserContext);
	const isDm: boolean = chan.includes("+");

	const [displayProfile, setDisplayProfile]: [UserData | null, Function] = useState(null);

	const [response, setResponse]: [ResponseMembers, Function] = useState({status: "loading"});
	useEffect(() => {
			GetRequest("/chat/getMembers/" + chan).then((response) => setResponse(response));
	}, [chan]);
	if (response.status === "loading")
		return (<Loading />);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);

	if (!response.data)
		return null
	if (!response.data[1])
		return <div>there is only you in this channel</div>
	if (isDm)
		return <Profile user={response.data[0].user} isDm={true} />
	if (displayProfile)
		return <Member user={displayProfile} setDisplayProfile={setDisplayProfile} />

	return (
		<div>
			{
				response.data.map(( member ) => 
					<div className="my-3" key={member.user.login}>
						{user === member.user.login ? null : <MemberButton user={member.user} setDisplayProfile={setDisplayProfile}/>}
					</div>
				)
			}
		</div>
	)
}