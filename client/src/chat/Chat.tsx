import { Socket, io } from "socket.io-client";
import { GetRequest, server_url } from "../utils/Request";
import { useEffect, useState } from "react";

export default function Chat() {
	
	useEffect(() => {
		const socket = io("http://" + process.env.REACT_APP_SERVER_HOST + ":" + "8181");
		console.log(socket);
	}, []);

	return (
		<>
			chat
		</>
	);
}