import axios from "axios";

export const server_url = "http://" + process.env.REACT_APP_SERVER_HOST + ":" + process.env.REACT_APP_SERVER_PORT;

export async function GetRequest(path: string) {
	const token = localStorage.getItem("token");
	let res: any;
	try { 
		const response = await axios.get(server_url + path, { headers: { authorization: "Bearer " + token } });
		res = { status: "OK", data: response.data };
	}
	catch (error: any) {
		if (error.code === "ERR_NETWORK")
			res = { status: "ERR_NETWORK", error: error.message };
		else
			res = { status: error.response.status, error: error.message };
	}
	return (res);
}

export async function PostRequest(path: string, data: JSON) {
	const token = localStorage.getItem("token");
	let res: any;
	try { 
		const response = await axios.post(server_url + path, data, { headers: { authorization: "Bearer " + token } });
		res = { status: "OK", data: response.data };
	}
	catch (error: any) {
		if (error.code === "ERR_NETWORK")
			res = { status: "ERR_NETWORK", error: error.message };
		else
			res = { status: error.response.status, error: error.message };
	}
	return (res);
}
