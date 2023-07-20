import { Module } from "@nestjs/common";
import { EventGateway } from "./event.gateway";
import { RelationshipModule } from "src/relationship/relationship.module";
import { EventService } from "./event.service";

@Module({
	providers: [EventGateway, EventService],
	imports: [RelationshipModule]
})
export class EventModule {}
