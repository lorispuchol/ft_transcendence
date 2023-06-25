import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css'
import Home from './home/Home';
import Profile, { RedirectToOwnProfile } from './user/Profile';
import LogIn from './user/LogIn';
import NoRouteFound from './NoRouteFound';
import { useEffect, useState } from 'react';
import { GetRequest } from './utils/Request';
import ErrorHandling from './utils/Error';
import Loading from './utils/Loading';

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
			<>
				<Routes>
					<Route path='*' element={<Navigate to='/login' />} />
					<Route path='/login' element={<LogIn />} />
				</Routes>
			</>
		);
	}
	if (data.status !== "OK")
		return (<ErrorHandling status={data.status} message={data.error} />);
	return (
		<Routes>
			<Route path='*' element={<NoRouteFound />} />
			<Route path='/' element={<Home />} />
			<Route path='/profile' element={<RedirectToOwnProfile />} />
			<Route path='/profile/:username' element={<Profile />} />
			<Route path='/login' element={<Navigate to='/' />} />
		</Routes>
	);
}

//ERR_NETWORK
