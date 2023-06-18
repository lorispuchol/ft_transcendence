import { Route, Routes } from 'react-router-dom';
import './App.css'
import Home from './home/Home';
import Profile from './user/Profile';
import LogIn from './user/LogIn';
import NoRouteFound from './NoRouteFound';
import axios from 'axios';
import { useState } from 'react';

export const server_url = "http://" + process.env.REACT_APP_SERVER_HOST + ":" + process.env.REACT_APP_SERVER_PORT;

export function GetRequest(path: string): any {
	const [ret , setRet] : [any, any]= useState(null);
	const token = localStorage.getItem("token")
	axios.get(server_url + path, {headers: {authorization: "Bearer " + token}}).then((response) => setRet(response.data)).catch(() => setRet(null));
	return ret;
}

export default function App() {
	return (
		<>
			<Routes>
				<Route path='*' element={<NoRouteFound />} />
				<Route path='/' element={<Home />} />
				<Route path='/profile' element={<Profile />} />
				<Route path='/login' element={<LogIn />} />
			</Routes>
		</>
	);
}
