import { Button, ButtonGroup, Paper } from "@mui/material";
import DemoGame from "./DemoGame";
import './Game.scss';
import { Pause, Public, RocketLaunch, SportsTennis, Weekend } from "@mui/icons-material";
import { useState } from "react";

interface MenuProps {
	setSetting: Function;
}

export default function GameMenu({ setSetting }: MenuProps) {
	const [type, setType]: [string, Function] = useState("local");
	const [mode, setMode]: [string, Function] = useState("classic");

	function focus(value: string) {
		if (type === value || mode === value)
			return "button_focus";
		return "";
	}

	return (
		<div className="menu_container">
			<div className="menu_wrapper">
				<Paper className="menu">
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
							
						</div>
					</div>
				</Paper>
			</div>
			<DemoGame />
		</div>
	)
}
