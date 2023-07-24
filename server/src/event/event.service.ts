import { Injectable } from "@nestjs/common";
import { EventGateway } from "./event.gateway";

interface Event {
	type: string,
	sender: string,
}

@Injectable()
export class EventService {
	constructor(
		private	eventGateway: EventGateway,
	) {}

	newEvent(login: string, event: Event) {
		this.eventGateway.newEvent(login, event);
	}
}
