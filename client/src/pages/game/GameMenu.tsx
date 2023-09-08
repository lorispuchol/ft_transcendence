import { Button, ButtonGroup, Paper } from "@mui/material";
import DemoGame from "./local/DemoGame";
import './GameMenu.scss';
import { Public, RocketLaunch, SportsTennis, Weekend } from "@mui/icons-material";
import { useContext, useEffect, useState } from "react";
import { EventContext } from "../../utils/Context";

interface MenuProps {
	setSetting: Function,
	setDefy: Function,
}

interface UserData {
	avatar: string | null,
	login: string,
	username: string,
}

export default function GameMenu({ setSetting, setDefy }: MenuProps) {
	const [type, setType]: [string, Function] = useState("local");
	const [mode, setMode]: [string, Function] = useState("classic");
	const [users, setUsers]: [UserData[], Function] = useState([]);
	const socket = useContext(EventContext)!;

	useEffect(() => {
		function addUser(newUser: UserData) {
			setUsers((prev: UserData[]) => [...prev, newUser])
		}
		function delUser(oldUser: UserData) {
			setUsers((prev: UserData[]) => prev.filter((user) => user.login !== oldUser.login))
		}
		socket.on('everyone', addUser);
		socket.on('userDisconnect', delUser);
		socket.emit("getConnected");

		return () => {
			socket.off('everyone', addUser);
			socket.off('userDisconnect', delUser);
		};
	}, [socket])

	function focus(value: string) {
		if (type === value || mode === value)
			return "button_focus";
		return "";
	}

	return (
		<div className="menu_container">
			<div className="menu_wrapper">
				<Paper className="main_menu">
					<div className="border-b-2 border-inherit">
						<ButtonGroup className="menu_select" orientation="vertical" variant="text">
							<Button key="local" className={focus("local")} onClick={() => setType("local")}><Weekend />local</Button>
							<Button key="online" className={focus("online")} onClick={() => setType("online")}><Public />online</Button>
						</ButtonGroup>
					</div>
					<div className="border-t-2 border-inherit">
						<ButtonGroup className="menu_select" orientation="vertical" variant="text">
							<Button key="classic" className={focus("classic")} onClick={() => setMode("classic")}><SportsTennis />classic</Button>
							<Button key="turbo" className={focus("turbo")} onClick={() => setMode("turbo")}><RocketLaunch />turbo</Button>
						</ButtonGroup>
					</div>
					<div className="menu_buttons">
						<Button key="play" onClick={() => setSetting({type: type, mode: mode})}>play</Button>
						<div className="defy">
							{
								users.map((user: UserData) => (
									<div key={user.login}>{user.username}</div>
								))
							}
						</div>
					</div>
				</Paper>
			</div>
			<DemoGame />
		</div>
	)
}
