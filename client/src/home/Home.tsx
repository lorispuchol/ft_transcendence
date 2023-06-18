
import { Link, Navigate } from "react-router-dom"
import { } from "../App";

export default function Home() {
	if (!localStorage.getItem("token"))
	 	return (<Navigate to='/login' />);
	return (
		<>
			home
			<Link to="/profile">
				<button>profile</button>
			</Link>
		</>
	);
}
