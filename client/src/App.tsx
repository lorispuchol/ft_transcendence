import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css'
import Home from './home/Home';
import Profile, { RedirectToOwnProfile } from './user/Profile';
import LogIn from './pages/LogIn/LogIn';
import NoRouteFound from './NoRouteFound';
import { useEffect, useState } from 'react';
import { GetRequest } from './utils/Request';
import ErrorHandling from './utils/Error';
import Loading from './utils/Loading';
// import ResponsiveAppBar from './navbar/NavBar';
import Chat from './chat/Chat';
import Everyone from './user/Everyone';
import Game from './game/Game';
import { RootLayout } from './navbar/RootLayout';

export default function App() {
	const [data, setData]: [any, any] = useState({status: "loading"});
	useEffect(() => {
			GetRequest("/auth/check_token").then((response) => setData(response));
	}, []);
	if (data.status === "loading")
		return (<Loading />);
	if (data.status === 401)
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
	if (data.status !== "OK")
		return (<ErrorHandling status={data.status} message={data.error} />);
	return (
		<div className='background_primary w-screen h-screen px-5 py-5 flex-wrap'>
			<RootLayout />
			<Routes>
				<Route path='*' element={<NoRouteFound />} />
				<Route path='/' element={<Home />} />
				<Route path='/profile' element={<RedirectToOwnProfile />} />
				<Route path='/profile/:username' element={<Profile />} />
				<Route path='/everyone' element={<Everyone />} />
				<Route path='/login' element={<Navigate to='/' />} />
				<Route path='/chat' element={<Chat />} />
				<Route path='/game' element={<Game />} />
			</Routes>
		</div>
	);
}

//ERR_NETWORK
