import { useContext, useEffect, useState } from "react";
import { GetRequest } from "../utils/Request";
import ErrorHandling from "../utils/Error";
import Loading from "../utils/Loading";
import { ChanMode, MemberDistinc, ParticipantData, UserData } from "./interfaceData";
import { defaultAvatar } from "../pages/Profile/Profile";
import { Avatar, Paper } from "@mui/material";
import UserStatus from "../components/user/UserStatus";
import { NavLink, useNavigate } from "react-router-dom";
import GamingButton from "../components/game/GamingButton";
import MessageButton from "./MessageButton";
import Friendbutton from "../components/Relationship/Friendbutton";
import BlockButton from "../components/Relationship/BlockButton";
import { DisplayMemberContext, RerenderListContext, SetDisplayMemberContext, SetRerenderListContext, UserContext } from "../utils/Context";
import './chat.scss'
import '../components/user/user.scss'
import { ArrowForward, SettingsApplications, VolumeOff } from "@mui/icons-material";
import { ControlButton } from "../components/ChatButton/ControlButtons";
import { MuteButton } from "../components/ChatButton/MuteButton";
import { InviteModule } from "../components/ChatButton/InviteModule";
import { LeaveButton } from "../components/ChatButton/LeaveButton";
import { ChangeAccessibility } from "../components/ChatButton/ChangeAccessibility";

interface MemberProps {
	member: UserData,
	userPart: ParticipantData,
	memberPart: ParticipantData,
}

interface MemberButtonProps {
	member: UserData,
	setDisplayProfile: Function,
	muted: boolean,
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
	settings: boolean,
	setSettings: Function,
}

function Profile({ member, isDm}: ProfileProps) {

	const avatar: any = member.avatar ? member.avatar : defaultAvatar;

	return (
		<div className="flex flex-col items-center my-3">
			<div className="relative m-2">
				<div className=""><Avatar sx={{ width: 128, height: 128 }} src={avatar} alt={member.username}/></div>
				<div className="absolute top-[100px] left-[100px]"><UserStatus userId={member.id} /></div>
			</div>
			<div className="tooltip tooltip-bottom" data-tip="go to profile"> 
				<NavLink to={'/profile/' + member.username}>
					<Paper className="everyone_username">{member.username}</Paper>
				</NavLink>
			</div>
			<div className="button_group flex flex-row items-center justify-center">
				{!isDm && <div className="message_button"><MessageButton receiverId={member.id}/></div>}
				<div className="friend_button"><Friendbutton id={member.id} /></div>
				<div className="block_button"><BlockButton id={member.id} /></div>
			</div>
			<div className="gaming_button"><GamingButton id={member.id}/></div>
		</div>
	)
}

function Member({ member, userPart, memberPart}: MemberProps) {
	
	const setDisplayProfile: Function = useContext(SetDisplayMemberContext);
	const rrList: number = useContext(RerenderListContext);
	const setRrList: Function = useContext(SetRerenderListContext);

	const control: boolean = ((userPart.distinction >= MemberDistinc.ADMIN) && (memberPart.distinction <= MemberDistinc.ADMIN));

	function close () {
		setDisplayProfile(null);
		setRrList(rrList + 1);
	}

	return (
		<div className="profile-module">
			<button onClick={close}><ArrowForward /></button>
			<Profile member={member} isDm={false} />
			{control && (
				<div className="control-group-buttons">
					<ControlButton memberPart={memberPart} distinction={MemberDistinc.KICK} />
					<ControlButton memberPart={memberPart} distinction={MemberDistinc.BANNED}/>
					{memberPart.distinction === MemberDistinc.ADMIN ?  
						<ControlButton memberPart={memberPart} distinction={MemberDistinc.MEMBER}/>
						: memberPart.distinction === MemberDistinc.MEMBER ?
							<ControlButton memberPart={memberPart} distinction={MemberDistinc.ADMIN}/>
							: null
					}
					<MuteButton memberPart={memberPart} />
				</div>
			)}
		</div>
	)
}

function MemberButton({ member, setDisplayProfile, muted}: MemberButtonProps) {
	
	const avatar: any = member.avatar ? member.avatar : defaultAvatar;
	const user = useContext(UserContext);

	const disabled: boolean = (member.username === user)

	return (
		<div className="my-3">
			<button disabled={disabled} onClick={() => setDisplayProfile(member)} className={`w-full flex flex-row flex-nowrap items-center member-button py-2 px-1 ${disabled && "user-member-disabled"}`}>
				<div className="relative mx-2">
					<div className=""><Avatar src={avatar} alt={member.username}/></div>
					<div className="absolute top-5 left-7"><UserStatus userId={member.id} /></div>
				</div>
				{
					disabled ?
							<p className="ml-3 mr-2 text-ellipsis overflow-hidden text-white">{member.username + " (me)"}</p>
						:	<p className="ml-3 mr-2 text-ellipsis overflow-hidden text-white">{member.username}</p>
				}
				{muted && <VolumeOff />}
			</button>
		</div>
	)
}

export default function ListMembers({ chan, settings, setSettings }: ListMembersProps) {

	const user = useContext(UserContext);
	const isDm: boolean = chan.includes("+");
	const navigate = useNavigate();

	const setDisplayProfile = useContext(SetDisplayMemberContext);
	const displayProfile: UserData | null = useContext(DisplayMemberContext);
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

	function closeSettings() {
		setSettings(false);
		setRerenderList(reRenderList + 1);
	}
	
	if (isDm) {
		if (!response.data[0] || !response.data[1])
			return null
		if (response.data[0].user.id !== userParticipant.user.id)
			return <Profile member={response.data[0].user} isDm={true} />
		else
			return <Profile member={response.data[1].user} isDm={true} />
	}
	if (displayProfile) {
		return (
			<SetRerenderListContext.Provider value={setRerenderList}>
			<RerenderListContext.Provider value={reRenderList}>
				<Member
					member={displayProfile}
					userPart={userParticipant}
					memberPart={response.data.find((member) => member.user.id === (displayProfile as UserData)!.id)!}
				/>
			</RerenderListContext.Provider>
			</SetRerenderListContext.Provider>
		)
	}
	if (!owner[0] || !owner[0].channel)
	{
		navigate("/chat", {replace: true, state: {to: null}})
		return (null);
	}
	else if (settings) {
		return (
			<div className="profile-module">
				<button onClick={closeSettings}><ArrowForward /></button>
				<p className="w-full flex flex-row items-center justify-center uppercase font-bold text-xl">{owner[0].channel.mode}</p>
				<hr className="mt-3 mb-3"/>
				<InviteModule chan={chan} />
				{userParticipant.distinction === MemberDistinc.OWNER && (
					<div>
						<hr className="mt-5 mb-3"/>
						<ChangeAccessibility 
							channel={owner[0].channel} 
							newMode={owner[0].channel.mode === ChanMode.PUBLIC ? ChanMode.PRIVATE : ChanMode.PUBLIC}
							reRenderList={reRenderList}
							setRerenderList={setRerenderList}
						/>
					</div>
				)}
				<hr className="my-5"/>
				<div className="w-full flex flex-col items-center justify-center">
					<LeaveButton chanName={chan}/>
				</div>
			</div>
		)
	}
	else {
		return (
			<div>
				{owner.length ? <p className="w-full flex flex-row items-center justify-center uppercase font-bold text-xl">{owner[0].channel.mode}</p> : null}
				{owner.length ? <p>Owner</p> : null}
				{
					owner.map((own) => 
						<MemberButton member={own.user} setDisplayProfile={setDisplayProfile} muted={false} key={own.user.login}/>
					)
				}
				{admins.length ? <p>Admins</p> : null}
				{
					admins.map((admin) =>
						<MemberButton member={admin.user} setDisplayProfile={setDisplayProfile} muted={(new Date(admin.muteDate) as any).getTime() > new Date().getTime()} key={admin.user.login} />
					)
				}
				{members.length ? <p>Members</p> : null}
				{
					members.map((member) => {
						return <MemberButton member={member.user} setDisplayProfile={setDisplayProfile} muted={(new Date(member.muteDate) as any).getTime() > new Date().getTime()} key={member.user.login} />
					})
				}
				<hr className="my-5"/>
				<button className="w-full btn send-button text-white" onClick={() => setSettings(true)}>
					<p>SETTINGS</p>
					<SettingsApplications />
				</button>
			</div>
		)
	}
}
