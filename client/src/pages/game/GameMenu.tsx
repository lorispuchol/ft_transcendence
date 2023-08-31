import { Paper } from "@mui/material";
import DemoGame from "./DemoGame";
import './Game.scss';

interface MenuProps {
	setMode: Function;
}

export default function GameMenu({ setMode }: MenuProps) {
	const mode = ["local", "online"];

	return (
		<div className="menu_container">
			<div className="menu_wrapper">
				<Paper className="menu">
					<div className="border-b-2 border-inherit">online/offline</div>
					<div className="border-t-2 border-inherit">classique/turbo</div>
					<div className="menu_buttons">local-play/online-search_defy</div>
				</Paper>
			</div>
			<DemoGame />
		</div>
	)
}
