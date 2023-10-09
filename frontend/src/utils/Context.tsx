import { createContext } from "react";
import { Socket } from "socket.io-client";

export const UserContext = createContext<string>("");
export const EventContext = createContext<Socket | null>(null);
export const SocketChatContext = createContext<Socket | null>(null);
export const SetRerenderListContext = createContext<Function>(() => {});
export const RerenderListContext = createContext<number>(0);
export const SetDisplayMemberContext = createContext<Function>(() => {});
