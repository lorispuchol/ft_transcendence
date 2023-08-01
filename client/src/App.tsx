import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css'
import Home from './home/Home';
import Profile, { RedirectToOwnProfile } from './pages/Profile/Profile';
import LogIn from './pages/LogIn/LogIn';
import NoRouteFound from './pages/Error/NoRouteFound';
import { useEffect, useState } from 'react';
import { GetRequest } from './utils/Request';
import ErrorHandling from './utils/Error';
import Loading from './utils/Loading';
import Chat from './chat/Chat';
import Everyone from './user/Everyone';
import Game from './game/Game';
import Loader from './components/Loading/Loader'
import { NavBar } from './components/NavBar/NavBar';
import { UserContext } from './utils/UserContext';

interface UserData {
	avatar: string,
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

export default function App() {
	const [response, setResponse]: [Response, Function] = useState({status: "loading"});
	useEffect(() => {
			GetRequest("/user/me").then((response) => setResponse(response));
	}, []);
	if (response.status === "loading")
		return (<Loading />);
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
		<UserContext.Provider value={response.data?.username}>
			<div className='background_primary px-5 py-5 background_app'>
				<NavBar />
				<Routes>
					<Route path='*' element={<NoRouteFound />} />
					<Route path='/' element={<Home />} />
					<Route path='/profile' element={<RedirectToOwnProfile />} />
					<Route path='/profile/:username' element={<Profile />} />
					<Route path='/everyone' element={<Everyone />} />
					<Route path='/login' element={<Navigate to='/' />} />
					<Route path='/chat' element={<Chat />} />
					<Route path='/game' element={<Game />} />
					<Route path='/loader' element={<Loader />} />
				</Routes>
			</div>
		</UserContext.Provider>
	);
}

//ERR_NETWORK
