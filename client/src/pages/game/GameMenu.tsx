import { Button, ButtonGroup, CircularProgress, Paper } from "@mui/material";
import DemoGame from "./local/DemoGame";
import './GameMenu.scss';
import { Public, RocketLaunch, SportsTennis, Weekend } from "@mui/icons-material";
import { useContext, useEffect, useState } from "react";
import { EventContext } from "../../utils/Context";
import Loader from "../../components/Loading/Loader";

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
	const [waitResponse, setWaitResponse]: [boolean, Function] = useState(false);
	const [select, setSelect]: [string | null, Function] = useState(null);
	const socket = useContext(EventContext)!;

	useEffect(() => {
		function addUser(newUser: UserData) {
			setUsers((prev: UserData[]) => [...prev, newUser])
		}
		function delUser(oldUser: UserData) {
			setUsers((prev: UserData[]) => prev.filter((user) => user.login !== oldUser.login));
			if (select === oldUser.login)
				setSelect(null);
		}
		function handleDefy(data: any) {
			console.log(select);
			if (data.login !== select)
				return ;
			if (data.response === "OK")
			{
				setDefy(select);
				setSetting({type: "online", mode: mode})
			}
			else
				setWaitResponse(false);
		}
		socket.on('everyone', addUser);
		socket.on('userDisconnect', delUser);
		socket.on("defy", handleDefy);
		
		return () => {
			socket.off('everyone', addUser);
			socket.off('userDisconnect', delUser);
			socket.off("defy", handleDefy);
		};
	}, [socket, select])
	
	useEffect(() => {
		socket.emit("getConnected");
	}, [])

	function focus(value: string) {
		if (type === value || mode === value)
			return "button_focus";
		return "";
	}

	function send_defy() {
		if (!select)
			return ;
		socket.emit("challenge", {to: select, mode: mode});
		setWaitResponse(true);
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
					{waitResponse ?
						<div className="menu_buttons wait">
							<div />
							<CircularProgress />
							<strong>waiting for response</strong>
							<div />
						</div>
					:
					<div className="menu_buttons">
						<Button key="play" onClick={() => setSetting({type: type, mode: mode})}>play</Button>
							<div className="defy">
								<div className="defy_list">
								{
									users.map((user: UserData) => (
										<div id="user" key={user.login} className={select === user.login? "defy_focus": ""} onClick={() => setSelect(user.login)}>{user.username}</div>
									))
								}
								</div>
							<Button key="defy" onClick={send_defy}>defy</Button>
							</div>
					</div>
					}
				</Paper>
			</div>
			<DemoGame />
		</div>
	)
}
