
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
import { RelationshipService } from "src/relationship/relationship.service";

@WebSocketGateway({
	namespace: "chat",
	cors: { origin: [client_url] },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
	constructor(
		private jwtService: JwtService,
		private chatService: ChatService,
		private userService: UserService,
		private relationshipService: RelationshipService,
	) {}

	private users: Map<string, Socket> = new Map();

	afterInit(server: Server) {}

	handleConnection(client: Socket, ...args: any[]) {
		const decoded: any = this.jwtService.decode(<string>client.handshake.headers.token);
		this.users.set(decoded.login, client);
	}

	handleDisconnect(client: Socket) {
		const decoded: any = this.jwtService.decode(<string>client.handshake.headers.token)
		this.users.delete(decoded.login);
	}
  
	@SubscribeMessage('message')
	async handleMessage(client: Socket, value: string[2]) {

		const decoded: any = this.jwtService.decode(<string>client.handshake.headers.token)

		//value[0]: channel name
		//value[1]: message content

		const channel: Channel = await this.chatService.findChanByName(value[0])
		const members: Participant[] = await this.chatService.getAllMembers(value[0])
		const sender: User =  await this.userService.findOneByLogin(decoded.login);

		const msg: Message = await this.chatService.saveNewMsg(sender, channel, value[1])

		const toEmits: Socket[] = []
		const promises = members.map( async (member) => {
			const socket: Socket = this.users.get(member.user.login)
			if (socket && await this.relationshipService.ReqIsBlocked(sender, member.user) === false) {
				toEmits.push(socket)
			}
		})
		Promise.all(promises).then(() => toEmits.map((socket) => socket.emit('message', {chan: value[0], msg: msg})))
	}
}