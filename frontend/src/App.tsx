import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css'
import Home from './pages/home/Home';
import Profile from './pages/Profile/Profile';
import LogIn from './pages/LogIn/LogIn';
import NoRouteFound from './pages/Error/NoRouteFound';
import { ReactElement, useEffect, useState } from 'react';
import { GetRequest, server_url } from './utils/Request';
import ErrorHandling from './utils/Error';
import Chat from './chat/Chat';
import Game from './pages/game/Game';
import Loader from './components/Loading/Loader'
import { NavBar } from './components/NavBar/NavBar';
import { EventContext, UserContext } from './utils/Context';
import { Socket, io } from 'socket.io-client';

interface UserData {
	avatar: string | null,
	login: string,
	username: string,
	nb_victory: number,
	nb_defeat: number,
}

interface Response {
	status: string | number,
	data?: UserData,
	error?: string,
}

function WebSocket({ children }: {children: ReactElement}) {
	const [socket, setSocket]: [Socket | null, Function] = useState(null);
	const [connected, setConnected]: [boolean, Function] = useState(false);

	useEffect(() => {
		//const id = setTimeout(() => {setConnected(true)}, 500);
		setConnected(true);
		const token = localStorage.getItem("token");
		const option = { transportOptions: { polling: { extraHeaders: { token: token }}}};
		const newSocket = io(server_url + "/event", option);

		//dev remettre pour prod
		// function notConnected () {
		// 	clearTimeout(id);
		// 	localStorage.clear();
		// 	window.location.replace(client_url);
		// }
		// newSocket.on("disconnect", notConnected);
		setSocket(newSocket);
		return () => {newSocket.close()};
	}, [setSocket, setConnected]);

	if (!socket || !connected)
		return (<Loader />);
	return (
		<EventContext.Provider value={socket}>
			{children}
		</EventContext.Provider>
	)
}

export default function App() {
	const [response, setResponse]: [Response, Function] = useState({status: "loading"});

	useEffect(() => {
			GetRequest("/user/me").then((response) => (setResponse(response)));
	}, []);

	if (response.status === "loading")
		return (<Loader />);
	if (response.status === 401)
	{
		return (
			<div className='background_primary w-screen h-screen flex justify-center items-center'>
				<Routes>
					<Route path='*' element={<Navigate to='/login' />} />
					<Route path='/login' element={<LogIn />} />
				</Routes>
			</div>
		);
	}
	if (response.status !== "OK")
		return (<ErrorHandling status={response.status} message={response.error} />);
	return (
		<WebSocket>
			<UserContext.Provider value={response.data?.username!}>
				<div className='background_primary w-screen px-5 py-5'>
					<NavBar />
					<Routes>
						<Route path='*' element={<NoRouteFound />} />
						<Route path='/' element={<Home />} />
						<Route path='/profile/:username' element={<Profile />} />
						<Route path='/login' element={<Navigate to='/' />} />
						<Route path='/chat' element={<Chat />} />
						<Route path='/game' element={<Game />} />
						<Route path='/loader' element={<Loader />} />
					</Routes>
				</div>
			</UserContext.Provider>
		</WebSocket>
	);
}
