import { useSearchParams } from "react-router-dom";
import { client_url, server_url } from "../../utils/Request";
import Loading from "../../utils/Loading";
import './LogIn.scss'

export default function LogIn() {
	const [searchParams] = useSearchParams();
	const tokenParam = searchParams.get("token");
	if (tokenParam)
	{
		localStorage.setItem("token", tokenParam);
		window.location.replace(client_url);
		return (<Loading />);
	}

	function clickButton() {
		const url = server_url + "/auth/";
		window.location.href=url;
	}

	return (
		<div className="box_login background_box_login">
			<div className="title_box">EL PONGO</div>
			<div className="button_box">
				<button className="button_login active:scale-110" onClick={clickButton}>LOG IN</button>
			</div>
		</div>
	);
}
