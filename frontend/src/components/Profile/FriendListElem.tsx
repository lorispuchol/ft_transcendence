import { Paper } from "@mui/material";
import { defaultAvatar } from "../../pages/Profile/Profile";
import { NavLink } from "react-router-dom";
import MessageButton from "../../chat/MessageButton";

interface FriendListProps {
	user: UserData
}

interface UserData {
	id: number,
	avatar: string,
	login: string,
	username: string
}

export default function FriendListElem({ user }: FriendListProps) {
	return (
		<NavLink to={'/profile/' + user.username}>
			<Paper className="friend_elem mb-4 mr-4">
				{user.avatar === null ?<img className="friend_elem_avatar" src={defaultAvatar} alt="FriendAvatar"/> : <img className="friend_elem_avatar" src={user.avatar} alt="FriendAvatar"/>}
				<div>{user.username}</div>
				<div className="message_button"><MessageButton receiverId={user.id}/></div>
			</Paper>
		</NavLink>
	)
}
