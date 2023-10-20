
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
	senderId: number | string,
	gameMode?: string
}

interface Sender {
	id: number,
	username: string,
}

interface UserInterval {
	userId: number,
	intervalId: NodeJS.Timer,
}

interface Challenge {
	to: number,
	mode: string
}

interface DefyReq {
	reqId: number,
	opId: number,
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

	async handleConnection(client: Socket) {
		const decoded: any = this.jwtService.decode(<string>client.handshake.headers.token);
		const newId: number = decoded?.id;

		const user: User = await this.eventService.getUserData(newId);
		const checkMultiAccount: Socket = [...this.users.entries()].filter(({ 1: value}) => value === newId).map(([key]) => key)[0];
		if (!user || checkMultiAccount)
		{
			client.disconnect();
			return ;
		}
		const newUser = {avatar: user.avatar, id: user.id, username: user.username, login: user.login};
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

	isAlreadyConnected(userId: number): boolean {
		const socket: Socket = [...this.users.entries()].filter(({ 1: value}) => value === userId).map(([key]) => key)[0];
		if (socket)
			return true;
		return false;
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

	private defyReq: DefyReq[] = [];

	@SubscribeMessage('challenge')
	async challenge (@MessageBody() data: Challenge, @ConnectedSocket() client: Socket) {
		const userId: number = this.users.get(client);
		const user = await this.eventService.getUserData(userId);

		if (await this.eventService.isBlocked(userId, data.to))
			client.emit("defy", {id: data.to, response: "KO"});
		
		this.defyReq.push({reqId: userId, opId: data.to, mode: data.mode});
		const event: Event = {type: "gameRequest", sender: user.username, senderId: user.id, gameMode: data.mode};
		this.newEvent(data.to, event);
	}

	@SubscribeMessage('cancelChallenge')
	async cancelChallenge (@ConnectedSocket() client: Socket) {
		const userId: number = this.users.get(client);

		let index: number = -1;
		this.defyReq.forEach((defy: DefyReq, i: number) => {
			if (defy.reqId === userId)
				index = i;
		})
		if (index === -1)
			return ;
		const deletedDefyReq = this.defyReq.splice(index, 1)[0];
		this.deleteEvent(deletedDefyReq.opId, {type: "gameRequest", sender: "", senderId: userId, gameMode: deletedDefyReq.mode});
	}

	private userInterval: UserInterval[] = []

	clearUserInterval(userId: number) {
		const index = this.userInterval.findIndex((elem: UserInterval) => {
			if (elem.userId !== userId)
			return 0;
			clearInterval(elem.intervalId);
			return 1;
		})
		this.userInterval.splice(index, 1);
	}

	@SubscribeMessage("clear")
	clear(@ConnectedSocket() client: Socket) {
		const userId = this.users.get(client);
		this.clearUserInterval(userId);
	}

	@SubscribeMessage("defyButton")
	waitDef(@MessageBody() defyId: number, @ConnectedSocket() client: Socket) {
		const userId = this.users.get(client);

		const intervalId = setInterval(() => {client.emit("waitDefy", defyId), console.log("interval button")}, 200);
		this.userInterval.push({userId, intervalId});
		setTimeout(() => {this.clearUserInterval(userId)}, 2000);
	}

	@SubscribeMessage('acceptGame')
	async acceptGame(@MessageBody() defyInfo: any, @ConnectedSocket() client: Socket) {
		const userId: number = this.users.get(client);
		
		client.emit("deleteEvent", {type: "gameRequest", senderId: defyInfo.senderId, sender: ""});
	
		const index: number  = this.defyReq.findIndex((elem: DefyReq) => (elem.reqId === defyInfo.senderId && elem.opId === userId))
		if (index === -1)
			return ;
		const mode = this.defyReq.splice(index, 1)[0].mode;
	
		const userSocket: Socket = [...this.users.entries()].filter(({ 1: value}) => value === defyInfo.senderId).map(([key]) => key)[0];
		userSocket.emit("defy", {opponentId: userId, mode: mode,response: "OK"});
		const intervalId = setInterval(() => {client.emit("goDefy", defyInfo), console.log("interval menu")}, 200);
		this.userInterval.push({userId, intervalId});
		setTimeout(() => {this.clearUserInterval(userId)}, 2000);
	}

	@SubscribeMessage('refuseGame')
	async refuseGame(@MessageBody() defyInfo: any, @ConnectedSocket() client: Socket) {
		const userId: number = this.users.get(client);

		client.emit("deleteEvent", {type: "gameRequest", senderId: defyInfo.senderId, sender: ""});

		const index: number  = this.defyReq.findIndex((elem: DefyReq) => (elem.reqId === defyInfo.senderId && elem.opId === userId));
		if (index === -1)
			return ;
		this.defyReq.splice(index, 1);
	 
		const userSocket: Socket = [...this.users.entries()].filter(({ 1: value}) => value === defyInfo.senderId).map(([key]) => key)[0];
		userSocket.emit("defy", {opponentId: userId, response: "KO", mode: ""});
	}
}
