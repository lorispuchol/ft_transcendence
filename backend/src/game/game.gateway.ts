
import { JwtService } from "@nestjs/jwt";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { client_url } from "src/auth/constants";
import PongGame from "./game.classique";
import Splatong from "./game.splatong";
import { GameService } from "./game.service";
import { EventService } from "src/event/event.service";
import { DefaultValuePipe, ParseIntPipe } from "@nestjs/common";

@WebSocketGateway({
	namespace: "game",
	cors: { origin: [client_url] },
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private jwtService: JwtService,
		private gameService: GameService,
		private eventService: EventService,
	) {}
		
	private users: Map<Socket, number> = new Map();
	private lobby: Map<number, PongGame | Splatong> = new Map();
	private spectator: Map<Socket, PongGame | Splatong> = new Map();
	private queue: {socket: Socket, mode: string}[] = [];
	private defyQueue: number[] = [];

	afterInit(server: Server) {}

	async handleConnection(@ConnectedSocket() client: Socket) {
		const decoded: any = this.jwtService.decode(<string>client.handshake.headers.token);
		const newId: number = decoded.id;;
		this.users.set(client, newId);
	}

	handleDisconnect(@ConnectedSocket() client: Socket) {
		const offId: number = this.users.get(client);

		this.queue = this.queue.filter((elem) => elem.socket.id !== client.id);
		this.defyQueue = this.defyQueue.filter((id) => id !== offId);
		this.users.delete(client);

		const specInstance = this.spectator.get(client);
		if (specInstance)
		{
			specInstance.spectator = specInstance.spectator.filter((socket: Socket) => (socket.id != client.id));
			this.spectator.delete(client);
		}

		this.gameService.rmUserInGame(offId);

		const instance: PongGame | Splatong = this.lobby.get(offId);
		if (!instance)
			return ;
		const otherPlayer = instance.handleDisconnect(offId);
		instance.clear();
		this.gameService.addNewMatch(instance.matchInfo());
		this.lobby.delete(offId);
		this.lobby.delete(otherPlayer);
		this.eventService.sendInGame(offId, otherPlayer, false);
	}

	@SubscribeMessage("search")
	async matchmaking(@MessageBody(new DefaultValuePipe("")) mode: string, @ConnectedSocket() client: Socket) {
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

		client.emit("matchmaking", {side: -1, p1: {score:0, id: opponentId, username: null},
			p2: {score:0, id: userId, username: null}
		});
		opponentSock.emit("matchmaking", {side: 1, p1: {score:0, id: opponentId, username: null},
			p2: {score:0, id: userId, username: null}
		});

		//create game with opponent
		let instance: PongGame | Splatong;
		if (mode === "classic") 
			instance = new PongGame(opponentId, opponentSock, userId, client);
		else
			instance = new Splatong(opponentId, opponentSock, userId, client);
		this.lobby.set(userId, instance);
		this.lobby.set(opponentId, instance);
		this.eventService.sendInGame(opponentId, userId, true);
		this.gameService.updateUserInGame([...this.lobby.keys()]);
	}

	@SubscribeMessage("waitSpectate")
	WaitSpectate(@MessageBody(ParseIntPipe) specId: number, @ConnectedSocket() client: Socket) {
		const instance = this.lobby.get(specId);
		if (!instance)
		{
			client.disconnect();
			return ;
		}

		this.spectator.set(client, instance);
		instance.spectator.push(client);

		const info = instance.getInfo();
		client.emit("goSpectate", {players: {side: 0, p1: {score: info.scoreP1, id: info.p1, username: null},
			p2: {score: info.scoreP2, id: info.p2, username: null}}, mode: info.mode, winnerId: info.winner});
	}

	@SubscribeMessage("getBackground")
	sendBackground(@ConnectedSocket() client: Socket) {
		const instance = this.spectator.get(client);
		instance?.sendBackground(client);
	}

	@SubscribeMessage("defy")
	async defy(@MessageBody(new DefaultValuePipe({defyId: 0, mode: ""})) defyInfo: {defyId: number, mode: string}, @ConnectedSocket() client: Socket) {
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
		this.eventService.sendInGame(defyId, userId, true);
		this.gameService.updateUserInGame([...this.lobby.keys()]);
	}

	@SubscribeMessage("ready")
	handleReady(@ConnectedSocket() client: Socket) {
		const userId = this.users.get(client);
		const instance = this.lobby.get(userId);
		instance?.ready(userId);
	}

	@SubscribeMessage("input")
	handleGameInput(@MessageBody(new DefaultValuePipe("")) input: string, @ConnectedSocket() client: Socket) {
		if (!input)
			return ;
		const userId = this.users.get(client);
		const instance = this.lobby.get(userId);

		instance?.input(userId, input);
	}

}
