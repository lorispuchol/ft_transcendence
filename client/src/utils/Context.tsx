import { createContext } from "react";
import { Socket } from "socket.io-client";
import { ParticipantData } from "../chat/interfaceData";

export const UserContext = createContext<string | undefined>("");
export const EventContext = createContext<Socket | null>(null);
export const SocketChatContext = createContext<Socket | null>(null);
export const ChannelContext = createContext<string>("");
export const UserParticipantContext = createContext<ParticipantData | null>(null);
export const OneMemberContext = createContext<ParticipantData | null>(null);
export const SetRerenderListMembersContext = createContext<Function>(() => {});
export const RerenderListMembersContext = createContext<number>(0);
