
import { JwtService } from "@nestjs/jwt";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { client_url } from "src/auth/constants";
import { UserService } from "src/user/user.service";
import { PongGame } from "./game.service";

@WebSocketGateway({
	namespace: "game",
	cors: { origin: [client_url] },
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private jwtService: JwtService,
		private userService: UserService,
		) {}
		
	private users: Map<Socket, number> = new Map();
	private lobby: Map<number, PongGame> = new Map();
	private queue: Socket[] = [];
	private defyQueue: number[] = [];

	afterInit(server: Server) {}

	async handleConnection(client: Socket, ...args: any[]) {
		const decoded: any = this.jwtService.decode(<string>client.handshake.headers.token);
		const newId: number = decoded.id;;
		this.users.set(client, newId);
	}

	handleDisconnect(client: Socket) {
		const offId: number = this.users.get(client);
		this.queue = this.queue.filter((socket) => socket.id !== client.id);
		this.defyQueue= this.defyQueue.filter((id) => id !== offId);
		this.users.delete(client);
		const instance: PongGame = this.lobby.get(offId);
		if (instance) {
			const otherPlayer = instance.handleDisconnect(offId);
			this.lobby.delete(offId);
			this.lobby.delete(otherPlayer);
		}
	}

	@SubscribeMessage("search")
	async matchmaking(@MessageBody() defy: number | null, @ConnectedSocket() client: Socket) {
		const id = this.users.get(client);
		const username = (await this.userService.findOneById(id)).username;

		if (defy)
		{
			const i = this.defyQueue.indexOf(defy);
			if (i < 0)
				this.defyQueue.push(id);
			else
			{
				const defyName = (await this.userService.findOneById(defy)).username;
				const openentSocket: Socket = [...this.users.entries()].filter(({ 1: value}) => defy === value).map(([key]) => key)[0];
				this.defyQueue.splice(i, 1);
				client.emit("matchmaking", {p1: {score:0, avatar: "", username: defyName}, p2: {score:0, avatar: "", username: username}});
				openentSocket.emit("matchmaking", {p1: {score:0, avatar: "", username: defyName}, p2: {score:0, avatar: "", username: username}});
				//need to create game with openent
			}
		}
		else if (!this.queue.length)
		{
			this.queue.push(client);
		}
		else
		{
			const openentSock = this.queue.shift();
			const openent: number = this.users.get(openentSock);
			const openentName: string = (await this.userService.findOneById(openent)).username;
			client.emit("matchmaking", {p1: {score:0, avatar: "", username: openentName}, p2: {score:0, avatar: "", username: username}});
			openentSock.emit("matchmaking", {p1: {score:0, avatar: "", username: openentName}, p2: {score:0, avatar: "", username: username}});
			//need to create game with openent
			const instance: PongGame = new PongGame(openent, openentSock, id, client);
			this.lobby.set(id, instance);
			this.lobby.set(openent, instance);
			instance.start();
		}
	}

	@SubscribeMessage("input")
	handleGameInput(@MessageBody() input: string, @ConnectedSocket() client: Socket) {
		const userId = this.users.get(client);
		const instance = this.lobby.get(userId);

		instance.input(userId, input);
	}
}