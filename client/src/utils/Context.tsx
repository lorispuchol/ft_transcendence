import { createContext } from "react";
import { Socket } from "socket.io-client";

export const UserContext = createContext<string | undefined>("");
export const EventContext = createContext<Socket | null>(null);
export const SocketChatContext = createContext<Socket | null>(null);
