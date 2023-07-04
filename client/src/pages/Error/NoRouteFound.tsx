import { Link } from "react-router-dom";

export default function NoRouteFound() {
	return (
		<>
			<strong>404 error </strong>
			<Link to="/">
				<button>go back to main page</button>
			</Link>
		</>
	);
}
