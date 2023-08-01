
import { JwtService } from "@nestjs/jwt";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { client_url } from "src/auth/constants";
import { v4 as uuidv4 } from 'uuid';
import { ChatService } from "./chat.service";
import { UserService } from "src/user/user.service";
import { Channel } from "./entities/channel.entity";

interface Message {
	id: string;
	user: string;
	value: string;
	time: number;
}
@WebSocketGateway({
	namespace: "chat",
	cors: { origin: [client_url] },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
	constructor(
		private jwtService: JwtService,
		private chatService: ChatService,
		private userService: UserService,
	) {}

	private messages: Set<Message> = new Set();
	private users: Map<Socket, string> = new Map();

	afterInit(server: Server) {}

	handleConnection(client: Socket, ...args: any[]) {
		const decoded: any = this.jwtService.decode(<string>client.handshake.headers.token);
		this.users.set(client, decoded.login);
	}

	handleDisconnect(client: Socket) {
		this.users.delete(client);
	}

	@SubscribeMessage('getMessages')
	getMessages(client: Socket) {
		this.messages.forEach((message) => client.emit('message', message));
	}
  
	@SubscribeMessage('message')
	handleMessage(client: Socket, value: string) {

		const user = this.users.get(client);
		const message: Message = {
			id: uuidv4(),
			user,
			value,
			time: Date.now(),
		};
  
		this.messages.add(message);
		this.users.forEach((login, cli) => cli.emit('message', message));
	}

	@SubscribeMessage('getDiscussions')
	async getDiscussions(client: Socket) {
		
		const decoded: any = this.jwtService.decode(<string>client.handshake.headers.token);
		const discussions: Channel[] = await this.chatService.getAllDiscuss(await this.userService.findOneByLogin(decoded.login))
		
		
		discussions.forEach((discussion) => client.emit('discussion', discussion));
	}

	// @SubscribeMessage('discussion')
	// handleDiscussion(){}	
}
