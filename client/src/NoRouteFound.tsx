import { Link, Navigate, useNavigate } from "react-router-dom";

export default function NoRouteFound() {
	const navigate = useNavigate();

	return (
		<>
			<strong>404 error</strong>
			<Link to="/">
				<button>go back to main page</button>
			</Link>
		</>
	);
}
