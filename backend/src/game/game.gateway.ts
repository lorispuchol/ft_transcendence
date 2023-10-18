
import { JwtService } from "@nestjs/jwt";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { client_url } from "src/auth/constants";
import PongGame from "./game.classique";
import Splatong from "./game.splatong";
import { GameService } from "./game.service";

@WebSocketGateway({
	namespace: "game",
	cors: { origin: [client_url] },
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private jwtService: JwtService,
		// @ts-ignore
		private gameService: GameService
	) {}
		
	private users: Map<Socket, number> = new Map();
	private lobby: Map<number, PongGame | Splatong> = new Map();
	private queue: {socket: Socket, mode: string}[] = [];
	private defyQueue: number[] = [];

	afterInit(server: Server) {}

	async handleConnection(client: Socket, ...args: any[]) {
		const decoded: any = this.jwtService.decode(<string>client.handshake.headers.token);
		const newId: number = decoded.id;;
		this.users.set(client, newId);
	}

	handleDisconnect(client: Socket) {
		const offId: number = this.users.get(client);
		this.queue = this.queue.filter((elem) => elem.socket.id !== client.id);
		this.defyQueue= this.defyQueue.filter((id) => id !== offId);
		this.users.delete(client);
		const instance: PongGame | Splatong = this.lobby.get(offId);
		if (instance) {
			const otherPlayer = instance.handleDisconnect(offId);
			console.log("other->" + otherPlayer);
			instance.clear();
			this.gameService.addNewMatch(instance.matchInfo());
			this.lobby.delete(offId);
			this.lobby.delete(otherPlayer);
		}
	}

	@SubscribeMessage("search")
	async matchmaking(@MessageBody() mode: string, @ConnectedSocket() client: Socket) {
		const userId = this.users.get(client);
		
		let opponentSock: Socket;
		this.queue = this.queue.filter((elem) => {
			if (!opponentSock && elem.mode === mode)
			{
				opponentSock = elem.socket;
				return 0;
			}
			return 1;
		});

		if (!opponentSock)
		{
			this.queue.push({socket: client, mode});
			return ;
		}

		const opponentId: number = this.users.get(opponentSock);

		client.emit("matchmaking", {side: -1, p1: {score:0, id: opponentId, username: null}, p2: {score:0, id: userId, username: null}});
		opponentSock.emit("matchmaking", {side: 1, p1: {score:0, id: opponentId, username: null}, p2: {score:0, id: userId, username: null}});

		//create game with opponent
		let instance: PongGame | Splatong;
		if (mode === "classic") 
			instance = new PongGame(opponentId, opponentSock, userId, client);
		else
			instance = new Splatong(opponentId, opponentSock, userId, client);
		this.lobby.set(userId, instance);
		this.lobby.set(opponentId, instance);
		setTimeout(() => instance.start(), 100);
	}

	@SubscribeMessage("defy")
	async defy(@MessageBody() defyInfo: {defyId: number, mode: string}, @ConnectedSocket() client: Socket) {
		const defyId = defyInfo.defyId;
		const userId = this.users.get(client);
		const i = this.defyQueue.indexOf(defyId);
		if (i < 0)
		{
			this.defyQueue.push(userId);
			return ;
		}

		this.defyQueue.splice(i, 1);
		const defySocket: Socket = [...this.users.entries()].filter(({ 1: value}) => value === defyId).map(([key]) => key)[0];

		client.emit("matchmaking", {side: -1, p1: {score:0, id: defyId, username: null}, p2: {score:0, id: userId, username: null}});
		defySocket.emit("matchmaking", {side: 1, p1: {score:0, id: defyId, username: null}, p2: {score:0, id: userId, username: null}});

		//create game with defy
		let instance: PongGame | Splatong;
		if (defyInfo.mode === "classic")
			instance = new PongGame(defyId, defySocket, userId, client);
		else
			instance = new Splatong(defyId, defySocket, userId, client);
		this.lobby.set(userId, instance);
		this.lobby.set(defyId, instance);
		setTimeout(() => instance.start(), 100);
	}

	@SubscribeMessage("input")
	handleGameInput(@MessageBody() input: string | undefined, @ConnectedSocket() client: Socket) {
		if (input == null)
			return ;
		const userId = this.users.get(client);
		const instance = this.lobby.get(userId);

		instance.input(userId, input);
	}

	//dev
	@SubscribeMessage("getState")
	getState(client: Socket) {
		console.log(
			"users->", this.users.values(),
			"lobby->", this.lobby.keys(), 
			"queue->", this.queue.length, 
			"defy->", this.defyQueue
		);
	}

	//dev
	@SubscribeMessage("flush")
	flush(client: Socket) {
		this.users = new Map();
		this.lobby = new Map();
		this.queue = [];
		this.defyQueue = []
	}
}
