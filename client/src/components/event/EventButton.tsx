import { Close, Done } from "@mui/icons-material";
import { Button } from "@mui/material";

interface Event {
	type: string,
	sender: string,
}

interface EventButtonProps {
	event: Event
}

export default function EventButton ({ event }: EventButtonProps) {

	return (
		<div className="grid grid-cols-2">
			<Button color="success"><Done/></Button>
			<Button color="error"><Close/></Button>
		</div>
	)
}
