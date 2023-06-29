
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from "@nestjs/websockets";
import { Observable, from, map } from "rxjs";
import { Server, Socket } from "socket.io";
import { client_url } from "src/auth/constants";

@WebSocketGateway(8181, {
	cors: { origin: [client_url] },
})
export class EventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

	@WebSocketServer()	wss: Server;

	afterInit(server: Server) {
		console.log('Initialized');
	}

	handleConnection(client: Socket, ...args: any[]) {
		console.log('client disconneted: ' + client.id);
	}

	handleDisconnect(client: Socket) {
		console.log('client disconnect: ' + client.id);
	}

	@SubscribeMessage('sendMessage')
	async handleSendmessage(client: Socket, payload: string): Promise<void> {
		console.log(payload);
		this.wss.emit('receiveMessage', payload);
	}

	@SubscribeMessage('event')
	findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
		return from([1, 2, 3]).pipe(map((item) => ({event: 'events', data: item})));
	}

	@SubscribeMessage('identity')
	async identity(@MessageBody() data: number): Promise<number> {
		return data;
	}
}
