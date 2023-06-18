
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { GetRequest, server_url } from "../App";

function handleClick() {

}

export default function LogIn() {
	const [searchParams] = useSearchParams();
	const tokenParam = searchParams.get("token");
	if (tokenParam)
		localStorage.setItem("token", tokenParam);
	const statu = GetRequest("/auth/ping").statu;
	if (statu === "true")
		return (
			<>
				login
				<button onClick={handleClick}>
					<a href={server_url + "/auth/"} >log in</a>
				</button>
			</>
		);
	return (<Navigate to='/' />);
}
// useEffect(() => {
// 	axios.post("server_url", {code: code}).then((response) => {
// 		setToken(response.data);
// 	});
// }, []);
// axios.post("http://10.12.8.2:8080/auth/login" , {code: code}).then((response) => {
// 	setToken(response.data);
// })
//, {headers: {'Access-Control-Allow-Origin': }}