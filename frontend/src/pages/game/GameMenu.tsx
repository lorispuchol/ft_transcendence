import { Button, ButtonGroup, CircularProgress, Paper } from "@mui/material";
import DemoGame from "./local/DemoGame";
import './GameMenu.scss';
import { Brush, Public, SportsTennis, Weekend } from "@mui/icons-material";
import { useContext, useEffect, useState } from "react";
import { EventContext } from "../../utils/Context";

interface MenuProps {
	setSetting: Function,
	setDefy: Function,
}

interface UserData {
	avatar: string | null,
	id: number,
	username: string,
}

interface DefyInfo {
	opponentId: number,
	mode: string,
	response: string,
}

export default function GameMenu({ setSetting, setDefy }: MenuProps) {
	const [type, setType]: [string, Function] = useState("local");
	const [mode, setMode]: [string, Function] = useState("classic");
	const [users, setUsers]: [UserData[], Function] = useState([]);
	const [waitResponse, setWaitResponse]: [boolean, Function] = useState(false);
	const [select, setSelect]: [number | null, Function] = useState(null);
	const socket = useContext(EventContext)!;

	useEffect(() => {
		function addUser(newUser: UserData) {
			setUsers((prev: UserData[]) => [...prev, newUser])
		}
		socket.on('everyone', addUser);
		function delUser(oldUser: UserData) {
			setUsers((prev: UserData[]) => prev.filter((user) => user.id !== oldUser.id));
			if (select === oldUser.id)
				setSelect(null);
		}
		socket.on('userDisconnect', delUser);
		function handleDefy(data: DefyInfo) {
			if (data.opponentId !== select || !waitResponse)
				return ;
			if (data.response === "OK")
			{
				setDefy(select);
				setSetting({type: "online", mode: data.mode})
			}
			else
				setWaitResponse(false);
		}
		socket.on("defy", handleDefy);
		function waitDefy(defyId: number) {
			socket.emit("clear");
			setSelect(defyId);
			setWaitResponse(true);
			socket.emit("challenge", {to: defyId, mode: "classic"});
		}
		socket.on("waitDefy", waitDefy);

		return () => {
			if (waitResponse)
				socket.emit("cancelChallenge");
			socket.off('everyone', addUser);
			socket.off('userDisconnect', delUser);
			socket.off("defy", handleDefy);
			socket.off("waitDefy", waitDefy);
		};
	})
	
	useEffect(() => {
		socket.emit("getConnected");
	}, [socket])

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

	function cancel_defy() {
		socket.emit("cancelChallenge");
		setWaitResponse(false);
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
							<Button key="turbo" className={focus("turbo")} onClick={() => setMode("turbo")}><Brush />splatong</Button>
						</ButtonGroup>
					</div>
					{waitResponse ?
						<div className="menu_buttons wait">
							<div />
							<CircularProgress />
							<strong>waiting for response</strong>
							<Button className="text-[1vw]" onClick={cancel_defy}>cancel</Button>
						</div>
					:
					<div className="menu_buttons">
						<Button key="play" onClick={() => setSetting({type: type, mode: mode})}>play</Button>
							<div className="defy">
								<div className="defy_list">
								{
									users.map((user: UserData) => (
										<div id="user" key={user.id} className={select === user.id ? "defy_focus": ""} onClick={() => setSelect(user.id)}>{user.username}</div>
									))
								}
								</div>
							<Button key="defy" className="text-[1.5vw]" onClick={send_defy}>defy</Button>
							</div>
					</div>
					}
				</Paper>
			</div>
			<DemoGame />
		</div>
	)
}
