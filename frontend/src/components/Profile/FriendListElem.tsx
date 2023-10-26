import { Paper } from "@mui/material";
import { defaultAvatar } from "../../pages/Profile/Profile";
import { NavLink } from "react-router-dom";

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
			<Paper className="friend_elem">
				{user.avatar === null ?<img className="friend_elem_avatar" src={defaultAvatar} alt="FriendAvatar"/> : <img className="friend_elem_avatar" src={user.avatar} alt="FriendAvatar"/>}
				<div>{user.username}</div>
			</Paper>
		</NavLink>
	)
}
