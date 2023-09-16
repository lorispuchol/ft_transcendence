export enum ChanMode {
	PUBLIC = "public",
	PRIVATE = "private",
	PROTECTED = "protected",
	DM = "dm"
}

export enum MemberDistinc {
	KICK = -2,
	BANNED = -1,
	INVITED = 0,
	MEMBER = 1,
	ADMIN = 2,
	OWNER = 3,
}

export enum RelationshipStatus {
	INVITED = "invited",
	ACCEPTED = "accepted",
	BLOCKED = "blocked",
}

export interface UserData {
	id: number,
	avatar: string,
	login: string,
	username: string,
	nb_victory: number,
	nb_defeat: number,
}

export interface RelationData{
	requester: UserData,
	recipient: UserData,
	status: string,
}

export interface ChannelData {
	id: number, 
	name: string,
	mode: ChanMode,
	password: string | null;
}

export interface ParticipantData {
	user: UserData,
	channel: ChannelData,
	distinction: MemberDistinc,
	mute: Date
}

export interface MessageData {
	id: number;
	sender: UserData;
	channel: ChannelData;
	content: string;
	date: Date;
}