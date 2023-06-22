
import { Navigate, useSearchParams } from "react-router-dom";

export default function LogIn() {
	const [searchParams] = useSearchParams();
	const tokenParam = searchParams.get("token");
	if (tokenParam)
		localStorage.setItem("token", tokenParam);
	
	// if (data.status === "401")
	// 	return (
	// 		<>
	// 			login
	// 			<button onClick={handleClick}>
	// 				<a href={server_url + "/auth/"} >log in</a>
	// 			</button>
	// 		</>
	// 	);
	// if (data.status !== "OK")
	// {
	// 	console.log("what? " + data.status);
	// 	return (<ErrorHandling error={data.error.status} />);
	// }
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