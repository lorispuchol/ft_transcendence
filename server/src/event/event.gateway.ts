
import { JwtService } from "@nestjs/jwt";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { client_url } from "src/auth/constants";
import { EventService } from "./event.service";
import { Inject, ParseIntPipe, forwardRef } from "@nestjs/common";
import { User } from "src/user/user.entity";

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
		@Inject(forwardRef(() => EventService))
			private eventService: EventService,
		private jwtService: JwtService,
	) {}
	
	private users: Map<Socket, string> = new Map();

	afterInit(server: Server) {}

	async handleConnection(client: Socket, ...args: any[]) {
		const decoded: any = this.jwtService.decode(<string>client.handshake.headers.token);
		const newLogin: string = decoded.login;
		const newUser: User = await this.eventService.getUserData(newLogin);
		this.users.set(client, newLogin);
		
		this.users.forEach(async (login, cli) => {
			if (await this.eventService.isBlocked(login, newLogin))
				return ;
			cli.emit("status/" + newLogin, "online");
			if (newLogin !== login)
				cli.emit("everyone", newUser);
		});
	}

	handleDisconnect(client: Socket) {
		const offLogin: string = this.users.get(client);
		this.users.delete(client);

		this.users.forEach(async (login, cli) => {
			if (await this.eventService.isBlocked(login, offLogin))
				return ;
			cli.emit("status/" + offLogin, "offline");
		})
	}

	@SubscribeMessage('getEvents')
	async getEvents(client: Socket) {
		const login: string = this.users.get(client);
		const events: Event[] = [];
		
		const friendReq: string[] = await this.eventService.getPendingInvitations(login);
		friendReq.map((login: string) => events.push({type: "friendRequest", sender: login}));
	
		events.map((event) => client.emit("event", event));
	}

	newEvent(login: string, event: Event) {
		const client: Socket = [...this.users.entries()].filter(({ 1: value}) => login === value).map(([key]) => key)[0];
		client?.emit("event", event);
	}

	deleteEvent(login: string, event: Event) {
		const client: Socket = [...this.users.entries()].filter(({ 1: value}) => login === value).map(([key]) => key)[0];
		client?.emit("deleteEvent", event);
	}

	@SubscribeMessage('getStatus')
	async getStatus(@MessageBody() userLogin: string, @ConnectedSocket() client: Socket) {
		const login: string = this.users.get(client);
		let userOnline: boolean = false;
		this.users.forEach((value) => value === userLogin ? userOnline = true : null);

		let userStatus: string;
		if ( await this.eventService.isBlocked(login, userLogin)) {userStatus = "blocked";}
		else if (userOnline) {userStatus = "online";}
		else {userStatus = "offline";}

		client.emit("status/" + userLogin, userStatus);
	}

}
