import { JwtService } from "@nestjs/jwt";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { client_url } from "src/auth/constants";

@WebSocketGateway({
	namespace: "event",
	cors: { origin: [client_url] },
})
export class EventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private jwtService: JwtService
	) {}
	
	@WebSocketServer() wss: Server;
	private users: Map<Socket, string> = new Map();

	afterInit(server: Server) {}

	handleConnection(client: Socket, ...args: any[]) {
		const decoded: any = this.jwtService.decode(<string>client.handshake.headers.token);
		this.users.set(client, decoded.login);
		//console.log(decoded.login + ' connected to event');
	}

	handleDisconnect(client: Socket) {
		this.users.delete(client);
		//console.log(' disconneted to event');
	}

	@SubscribeMessage('getEvents')
	getEvents(client: Socket) {
		client.emit("event", {id: 1, login: "loris la merde"})
		client.emit("event", {id: 2, login: "oui"})
	}

	@SubscribeMessage('event')
	newEvent(client: Socket) {
	}
}
