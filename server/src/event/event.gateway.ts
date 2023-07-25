
import { JwtService } from "@nestjs/jwt";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { client_url } from "src/auth/constants";
import { EventService } from "./event.service";
import { Relationship, RelationshipStatus } from "src/relationship/relationship.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { UserService } from "src/user/user.service";
import { User } from "src/user/user.entity";

interface Event {
	type: string,
	sender: string,
}

@WebSocketGateway({
	namespace: "event",
	cors: { origin: [client_url] },
})
export class EventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		@InjectRepository(Relationship, 'lorisforever')
		private relationshipRepository: Repository<Relationship>,
		private userService: UserService,
		private jwtService: JwtService,
	) {}
	
	private users: Map<Socket, string> = new Map();

	afterInit(server: Server) {}

	handleConnection(client: Socket, ...args: any[]) {
		const decoded: any = this.jwtService.decode(<string>client.handshake.headers.token);
		this.users.set(client, decoded.login);
	}

	handleDisconnect(client: Socket) {
		this.users.delete(client);
	}

	@SubscribeMessage('getEvents')
	async getEvents(client: Socket) {
		const login: string = this.users.get(client);
		const events: Event[] = [];
		
		const friendReq: string[] = await this.getPendingInvitations(login);
		friendReq.map((login: string) => events.push({type: "friendRequest", sender: login}));
	
		events.map((event) => client.emit("event", event));
	}

	newEvent(login: string, event: Event) {
		const client: Socket = [...this.users.entries()].filter(({ 1: value}) => login === value).map(([key]) => key)[0];
		console.log(client);
		client.emit("event", event);
	}

	async getPendingInvitations(login: string): Promise<string[]> {
		
		const user: User = await this.userService.findOneByLogin(login);
		const pendingInvitations: Relationship[] = await this.relationshipRepository.find({
			where: {
				recipient: user.id,
				status: RelationshipStatus.INVITED
			} as FindOptionsWhere<User>
		});

		const logins: string[] = [];
		pendingInvitations.forEach((invitation) => logins.push(invitation.requester.username))
		return logins;
	}
}
