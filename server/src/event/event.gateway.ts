
import { Request } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { Observable, from, map } from "rxjs";
import { Server, Socket } from "socket.io";
import { client_url } from "src/auth/constants";
import { v4 as uuidv4 } from 'uuid';

interface Message {
	id: string;
	user: string;
	value: string;
	time: number;
}

@WebSocketGateway({
	namespace: "event",
	cors: { origin: [client_url] },
})
export class EventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
	constructor(
		private jwtService: JwtService
	) {}

	@WebSocketServer( )	wss: Server;
	private messages: Set<Message> = new Set();
	private users: Map<Socket, string> = new Map();

	afterInit(server: Server) {
		console.log('Initialized');
	}

	handleConnection(client: Socket, ...args: any[]) {
		const decoded: any = this.jwtService.decode(<string>client.handshake.headers.token);
		const login = decoded.login;
		this.users.set(client, login);
		console.log('client conneted: ' + client.id);
	}

	handleDisconnect(client: Socket) {
		this.users.delete(client);
		console.log('client disconnect: ' + client.id);
	}

	@SubscribeMessage('getMessages')
	getMessages(client: Socket) {
		this.messages.forEach((message) => this.sendMessage(client, message));
	}
  
	@SubscribeMessage('message')
	handleMessage(client: Socket, value: string) {

		const user = this.users.get(client);
		console.log(user + " sended message");
		const message: Message = {
			id: uuidv4(),
			user,
			value,
			time: Date.now(),
		};
  
		this.messages.add(message);
		this.users.forEach((login, socket) => socket.emit('message', message));
		//this.sendMessage(client, message);
  
	}
  
	private sendMessage(client: Socket, message: Message) {
		client.emit('message', message);
	}

	// @SubscribeMessage('sendMessage')
	// async handleSendmessage(client: Socket, payload: string): Promise<void> {
	// 	console.log(payload);
	// 	this.wss.emit('receiveMessage', payload);
	// }

	// @SubscribeMessage('event')
	// findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
	// 	return from([1, 2, 3]).pipe(map((item) => ({event: 'events', data: item})));
	// }

	// @SubscribeMessage('identity')
	// async identity(@MessageBody() data: number): Promise<number> {
	// 	return data;
	// }
}
