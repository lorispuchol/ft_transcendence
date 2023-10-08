
import { JwtService } from "@nestjs/jwt";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { client_url } from "src/auth/constants";
import { EventService } from "./event.service";
import { Inject, forwardRef } from "@nestjs/common";
import { User } from "src/user/user.entity";

interface Event {
	type: string,
	sender: string,
	senderId: number,
	gameMode?: string
}

interface Sender {
	id: number,
	username: string,
}

interface Challenge {
	to: number,
	mode: string
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
	
	private users: Map<Socket, number> = new Map();

	afterInit(server: Server) {}

	async handleConnection(client: Socket, ...args: any[]) {
		const decoded: any = this.jwtService.decode(<string>client.handshake.headers.token);
		const newId: number = decoded.id;
		const user: User = await this.eventService.getUserData(newId);
		if (!user)
		{
			client.disconnect();
			return ;
		}
		const newUser = {avatar: user.avatar, id: user.id, username: user.username};
		this.users.set(client, newId);
		
		this.users.forEach(async (id, socket) => {
			if (await this.eventService.isBlocked(id, newId))
				return ;
			socket.emit("status/" + newId, "online");
			if (newId !== id)
				socket.emit("everyone", newUser);
		});
	}

	async handleDisconnect(client: Socket) {
		const offId: number = this.users.get(client);
		const user: User = await this.eventService.getUserData(offId);
		if (!user)
			return ;
		const offUser = {avatar: user.avatar, id: offId, username: user.username};

		this.users.forEach(async (id, socket) => {
			if (await this.eventService.isBlocked(id, offId))
			return ;
			socket.emit("status/" + offId, "offline");
			socket.emit("userDisconnect", offUser);
		})
		this.users.delete(client);
	}

	@SubscribeMessage('getConnected')
	getConnected(client: Socket) {
		const userId: number = this.users.get(client);

		this.users.forEach(async (id) => {
			if (await this.eventService.isBlocked(id, userId) || await this.eventService.isBlocked(userId, id))
				return ;
			if (userId !== id)
			{
				const user: User = await this.eventService.getUserData(id);
				const toSend = {avatar: user.avatar, id: user.id, username: user.username};
				client.emit("everyone", toSend);
			}
		});
	}

	@SubscribeMessage('getEvents')
	async getEvents(client: Socket) {
		const userId: number = this.users.get(client);
		const events: Event[] = [];
		
		const friendReq: Sender[] = await this.eventService.getPendingInvitations(userId);
		const channelReq: Sender[] = await this.eventService.getPendingInvitationsChannel(userId);

		friendReq.map((sender: Sender) => events.push({type: "friendRequest", sender: sender.username, senderId: sender.id}));
		channelReq.map((channel: Sender) => events.push({type: "channelInvitation", sender: channel.username, senderId: channel.id}));
	
		events.map((event) => client.emit("event", event));
	}

	newEvent(userId: number, event: Event) {
		const client: Socket = [...this.users.entries()].filter(({ 1: value}) => value === userId).map(([key]) => key)[0];
		client?.emit("event", event);
	}

	deleteEvent(userId: number, event: Event) {
		const client: Socket = [...this.users.entries()].filter(({ 1: value}) => value === userId).map(([key]) => key)[0];
		client?.emit("deleteEvent", event);
	}

	@SubscribeMessage('getStatus')
	async getStatus(@MessageBody() statuId: number, @ConnectedSocket() client: Socket) {
		const userId: number = this.users.get(client);
		let userOnline: boolean = false;
		this.users.forEach((id) => id === statuId ? userOnline = true : null);

		let userStatus: string;
		if ( await this.eventService.isBlocked(userId, statuId)) {userStatus = "blocked";}
		else if (userOnline) {userStatus = "online";}
		else {userStatus = "offline";}

		client.emit("status/" + statuId, userStatus);
	}


	@SubscribeMessage('challenge')
	async challenge (@MessageBody() data: Challenge, @ConnectedSocket() client: Socket) {
		const userId: number = this.users.get(client);
		const user = await this.eventService.getUserData(userId);

		if ( await this.eventService.isBlocked(userId, data.to))
			client.emit("defy", {id: data.to, response: "KO"});
		
		const event: Event = {type: "gameRequest", sender: user.username, senderId: user.id, gameMode: data.mode};
		this.newEvent(data.to, event);
	}

	@SubscribeMessage('acceptGame')
	async acceptGame(@MessageBody() senderId: number, @ConnectedSocket() client: Socket) {
		const userId: number = this.users.get(client);
		
		client.emit("deleteEvent", {type: "gameRequest", senderId: senderId, sender: ""});

		const userSocket: Socket = [...this.users.entries()].filter(({ 1: value}) => value === senderId).map(([key]) => key)[0];
		userSocket.emit("defy", {id: userId, response: "OK"});
	}

	@SubscribeMessage('refuseGame')
	async refuseGame(@MessageBody() senderId: number, @ConnectedSocket() client: Socket) {
		const userId: number = this.users.get(client);

		client.emit("deleteEvent", {type: "gameRequest", senderId: senderId, sender: ""});

		const userSocket: Socket = [...this.users.entries()].filter(({ 1: value}) => value === senderId).map(([key]) => key)[0];
		userSocket.emit("defy", {id: userId, response: "KO"});
	}
}
