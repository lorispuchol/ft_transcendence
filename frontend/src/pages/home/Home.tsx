import Everyone from "../../components/user/Everyone";
import Header from "../../components/home/Header"
import Us from "../../components/home/Us";
import './Home.scss';


export default function Home() {
	return (
		<div>
			<Header />
			<div className="list_container">
				<Everyone />
			</div>
			<Us />
		</div>
	);
}
