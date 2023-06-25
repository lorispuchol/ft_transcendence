
import { Link, Navigate } from "react-router-dom"
import ResponsiveAppBar from "./NavBar";

export default function Home() {
	if (!localStorage.getItem("token"))
	 	return (<Navigate to='/login' />);
	return (
		<>
			<ResponsiveAppBar />
			<div><strong><u>home</u></strong></div>
			<div><Link to="/profile"><button>profile</button></Link></div>
		</>
	);
}
