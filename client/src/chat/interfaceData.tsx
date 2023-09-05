export enum ChanMode {
	PUBLIC = "public",
	PRIVATE = "private",
	PROTECTED = "protected",
	DM = "dm"
}

export enum MemberDistinc {
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
	mode: string,
	password: string | null;
}

export interface ParticipantData {
	user: UserData,
	channel: ChannelData
	distinction: number 
}

export interface MessageData {
	id: number;
	sender: UserData;
	channel: ChannelData;
	content: string;
	date: Date;
}