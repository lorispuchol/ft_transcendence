import { Route, Routes } from 'react-router-dom';
import './App.css'
import Home from './home/Home';
import Profile, { RedirectToOwnProfile } from './user/Profile';
import LogIn from './user/LogIn';
import NoRouteFound from './NoRouteFound';

export function ServerError() {
	return (<>
		<strong>server is in PLS, try again later pls</strong>
	</>);
}

export default function App() {
	return (
		<>
			<Routes>
				<Route path='*' element={<NoRouteFound />} />
				<Route path='/' element={<Home />} />
				<Route path='/profile' element={<RedirectToOwnProfile />} />
				<Route path='/profile/:username' element={<Profile />} />
				<Route path='/login' element={<LogIn />} />
			</Routes>
		</>
	);
}

//ERR_NETWORK
