import { useContext, useEffect, useState } from "react";
import { GetRequest } from "../utils/Request";
import ErrorHandling from "../utils/Error";
import Loading from "../utils/Loading";
import { MemberDistinc, ParticipantData, UserData } from "./interfaceData";
import { defaultAvatar } from "../pages/Profile/Profile";
import { Avatar, Paper } from "@mui/material";
import UserStatus from "../user/UserStatus";
import { NavLink } from "react-router-dom";
import GamingButton from "../components/game/GamingButton";
import MessageButton from "./MessageButton";
import Friendbutton from "../components/Relationship/Friendbutton";
import BlockButton from "../components/Relationship/BlockButton";
import { logInfo } from "./Chat";
import { OneMemberContext, RerenderListMembersContext, SetRerenderListMembersContext, UserContext, UserParticipantContext } from "../utils/Context";
import './chat.scss'
import '../user/user.scss'
import { ArrowForward } from "@mui/icons-material";
import { KickButton } from "./ControlChanButton";

interface MemberProps {
	member: UserData,
	setDisplayProfile: Function,
}
interface ResponseMembers {
	status: string | number,
	data?: ParticipantData[],
	error?: string,
}

interface ProfileProps {
	member: UserData,
	isDm: boolean,
}
interface ListMembersProps {
	chan: string
}

function log(message: string) {
	logInfo(message);
}

function Profile({ member, isDm}: ProfileProps) {

	const avatar: any = member.avatar ? member.avatar : defaultAvatar;

	return (
		<div className="flex flex-col items-center my-3">
			<div className="relative m-2">
				<div className=""><Avatar sx={{ width: 128, height: 128 }} src={avatar} alt={member.username}/></div>
				<div className="absolute top-[100px] left-[100px]"><UserStatus login={member.login} /></div>
			</div>
			<div className="tooltip tooltip-bottom" data-tip="go to profile"> 
				<NavLink to={'/profile/' + member.login}>
					<Paper className="everyone_username">{member.username}</Paper>
				</NavLink>
			</div>
			<div className="button_group flex flex-row items-center justify-center">
				{!isDm && <div className="message_button"><MessageButton receiver={member.login}/></div>}
				<div className="friend_button"><Friendbutton login={member.login} render={log} /></div>
				<div className="block_button"><BlockButton login={member.login} render={log} /></div>
			</div>
			<div className="gaming_button"><GamingButton login={member.login}/></div>
		</div>
	)
}

function Member({ member, setDisplayProfile }: MemberProps) {

	const userPart: ParticipantData = useContext(UserParticipantContext)!;
	const memberPart: ParticipantData = useContext(OneMemberContext)!;
	const control: boolean = ((userPart.distinction >= MemberDistinc.ADMIN) && (memberPart.distinction <= MemberDistinc.ADMIN));

	const rerenderList = useContext(RerenderListMembersContext);
	const setRerenderList = useContext(SetRerenderListMembersContext);

	function close () {
		setDisplayProfile(null);
		setRerenderList(rerenderList + 1); // a mettre dans le onCLick des button kick ban
	}

	return (
		<div className="profile-module">
			<button onClick={close}><ArrowForward /></button>
			<Profile member={member} isDm={false} />
			<div className="flex flex-row items-center justify-center my-8">
				{/* <KickButton /> */}
				<button disabled={!control}>KICK</button>
			</div>
		</div>
	)
}

function MemberButton({ member, setDisplayProfile}: MemberProps) {
	
	const avatar: any = member.avatar ? member.avatar : defaultAvatar;
	const user = useContext(UserContext);

	const disabled: boolean = (member.username === user)

	return (
		<div className="my-3">
			<button disabled={disabled} onClick={() => setDisplayProfile(member)} className={`w-full flex flex-row flex-nowrap items-center member-button py-2 px-1 ${disabled && "user-member-disabled"}`}>
				<div className="relative mx-2">
					<div className=""><Avatar src={avatar} alt={member.username}/></div>
					<div className="absolute top-5 left-7"><UserStatus login={member.login} /></div>
				</div>
				{
					disabled ?
							<p className="ml-3 mr-2 text-ellipsis overflow-hidden text-white">{member.username + " (me)"}</p>
						:	<p className="ml-3 mr-2 text-ellipsis overflow-hidden text-white">{member.username}</p>
				}
			</button>
		</div>
	)
}

export default function ListMembers({chan}: ListMembersProps) {

	const user = useContext(UserContext);
	const isDm: boolean = chan.includes("+");

	const [displayProfile, setDisplayProfile]: [UserData | null, Function] = useState(null);
	const [reRenderList, setRerenderList]: [number, Function] = useState(0);

	const [response, setResponse]: [ResponseMembers, Function] = useState({status: "loading"});
	useEffect(() => {
			GetRequest("/chat/getMembers/" + chan).then((response) => setResponse(response));
	}, [chan, reRenderList]);
	if (response.status === "loading")
		return (<Loading />);
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);
	if (!response.data)
		return null
	const userParticipant: ParticipantData = response.data.find((member) => member.user.username === user)!;
	const owner: ParticipantData[] = response.data.filter((member) => member.distinction === 3)!;
	const admins: ParticipantData[] = response.data.filter((member) => member.distinction === 2)!;
	const members: ParticipantData[] = response.data.filter((member) => member.distinction === 1)!;
	
	if (isDm)
		return <Profile member={response.data[0].user} isDm={true} />
	if (displayProfile) {
		return (
			<RerenderListMembersContext.Provider value={reRenderList}>
			<SetRerenderListMembersContext.Provider value={setRerenderList}>					
				<UserParticipantContext.Provider value={userParticipant}>
				<OneMemberContext.Provider value={response.data.find((member) => member.user.id === (displayProfile as UserData)!.id)!}>
					
					<Member member={displayProfile} setDisplayProfile={setDisplayProfile} />
				
				</OneMemberContext.Provider>
				</UserParticipantContext.Provider>
			</SetRerenderListMembersContext.Provider>
			</RerenderListMembersContext.Provider>

		)
	}

	return (
		<div>
			{owner.length ? <p>Owner</p> : null}
			{
				owner.map((own) => 
					<MemberButton member={own.user} setDisplayProfile={setDisplayProfile} key={own.user.login}/>
				)
			}
			{admins.length ? <p>Admins</p> : null}
			{
				admins.map((admin) =>
					<MemberButton member={admin.user} setDisplayProfile={setDisplayProfile} key={admin.user.login}/>
				)
			}
			{members.length ? <p>Members</p> : null}
			{
				members.map((member) =>
					<MemberButton member={member.user} setDisplayProfile={setDisplayProfile} key={member.user.login}/>
				)
			}
		</div>
	)
}