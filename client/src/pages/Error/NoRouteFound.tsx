import { Link } from "react-router-dom";
import './Error.scss'

export default function NoRouteFound() {
	return (
		<div className='centered'>
			<div className="block_404">
				<div className='text-9xl'>404</div>
				<div className='mb-8 text-2xl'>PAGE NOT FOUND</div>
				<div>
						<Link to="/">
							<div className="p-2 rounded border border-black bg-white">GO BACK TO HOMEPAGE</div>
						</Link>
				</div>
			</div>
		</div>
	);
}
