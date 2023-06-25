
import { Link, Navigate } from "react-router-dom"
import ResponsiveAppBar from "./NavBar";

export default function Home() {
	if (!localStorage.getItem("token"))
	 	return (<Navigate to='/login' />);
	return (
		<>

			<div><strong><u>home</u></strong></div>
		</>
	);
}
