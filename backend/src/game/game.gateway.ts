
import { JwtService } from "@nestjs/jwt";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { client_url } from "src/auth/constants";

@WebSocketGateway({
	namespace: "game",
	cors: { origin: [client_url] },
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private jwtService: JwtService,
		) {}
		
	private users: Map<Socket, string> = new Map();
	private queue: Socket[] = [];
	private defyQueue: string[] = [];

	afterInit(server: Server) {}

	async handleConnection(client: Socket, ...args: any[]) {
		const decoded: any = this.jwtService.decode(<string>client.handshake.headers.token);
		const newLogin: string = decoded.login;;
		this.users.set(client, newLogin);
	}

	handleDisconnect(client: Socket) {
		const offLogin: string = this.users.get(client);
		this.queue = this.queue.filter((socket) => socket.id !== client.id);
		this.defyQueue= this.defyQueue.filter((login) => login !== offLogin);
		this.users.delete(client);
	}

	@SubscribeMessage("search")
	matchmaking(@MessageBody() defy: string | null, @ConnectedSocket() client: Socket) {
		const login = this.users.get(client);

		if (defy)
		{
			const i = this.defyQueue.indexOf(defy);
			if (i < 0)
				this.defyQueue.push(login);
			else
			{
				const openentSocket: Socket = [...this.users.entries()].filter(({ 1: value}) => defy === value).map(([key]) => key)[0];
				this.defyQueue.splice(i, 1);
				client.emit("matchmaking", {p1: {score:0, avatar: "", username: defy}, p2: {score:0, avatar: "", username: login}});
				openentSocket.emit("matchmaking", {p1: {score:0, avatar: "", username: defy}, p2: {score:0, avatar: "", username: login}});
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
			const openent = this.users.get(openentSock);
			client.emit("matchmaking", {p1: {score:0, avatar: "", username: openent}, p2: {score:0, avatar: "", username: login}});
			openentSock.emit("matchmaking", {p1: {score:0, avatar: "", username: openent}, p2: {score:0, avatar: "", username: login}});
			//need to create game with openent
		}
	}
}