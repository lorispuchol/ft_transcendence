import { JwtService } from "@nestjs/jwt";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { client_url } from "src/auth/constants";
import { RelationshipService } from "src/relationship/relationship.service";

interface Event {
	type: string,
	sender: string,
}

@WebSocketGateway({
	namespace: "event",
	cors: { origin: [client_url] },
})
export class EventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private jwtService: JwtService,
		private relationshipService: RelationshipService,
	) {}
	
	private users: Map<Socket, string> = new Map();

	afterInit(server: Server) {}

	handleConnection(client: Socket, ...args: any[]) {
		const decoded: any = this.jwtService.decode(<string>client.handshake.headers.token);
		this.users.set(client, decoded.login);
	}

	handleDisconnect(client: Socket) {
		this.users.delete(client);
	}

	@SubscribeMessage('getEvents')
	async getEvents(client: Socket) {
		const login: string = this.users.get(client);
		const events: Event[] = [];
		
		const friendReq: string[] = await this.relationshipService.getPendingInvitations(login);
		friendReq.push("mario")
		friendReq.map((login: string) => events.push({type: "friendRequest", sender: login}));
	
		events.map((event) => client.emit("event", event));
	}

	newEvent(login: string, event: Event) {
		const client = [...this.users].find(([key, value]) => (login === value))[0];
		client.emit("event", event);
	}
}

//format event = {type,sender}