
import { JwtService } from "@nestjs/jwt";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { client_url } from "src/auth/constants";
import { ChatService } from "./chat.service";
import { UserService } from "src/user/user.service";
import { Channel } from "./entities/channel.entity";
import { User } from "src/user/user.entity";
import { Participant } from "./entities/participant_chan_x_user.entity";
import { Message } from "./entities/message.entity";

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
  
	@SubscribeMessage('message')
	async handleMessage(client: Socket, value: string[2]) {

		//value[0]: channel name
		//value[1]: message content
		
		const channel: Channel = await this.chatService.findChanByName(value[0])
		const members: Participant[] = await this.chatService.getAllMembers(value[0])
		const sender: User =  await this.userService.findOneByLogin(this.users.get(client));

		const msg: Message = await this.chatService.saveNewMsg(sender, channel, value[1])

		members.map((member) => {
			this.users.forEach((login, socket) => {
				if (login === member.user.login)
					socket.emit('message', msg);
			})
		})
	}
}