import axios from "axios";

export const server_url = "http://" + process.env.REACT_APP_SERVER_HOST + ":" + process.env.REACT_APP_SERVER_PORT;
export const client_url = "http://" + process.env.REACT_APP_SERVER_HOST + ":" + process.env.REACT_APP_CLIENT_PORT;

interface Response {
	status: string,
	data?: Object,
	error?: string,
}

export async function GetRequest(path: string) {
	const token = localStorage.getItem("token");
	console.log("token: " + token);
	let res: Response;
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
	let res: Response;
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

export async function PatchRequest(path: string, data: JSON) {
	const token = localStorage.getItem("token");
	let res: Response;
	try { 
		const response = await axios.patch(server_url + path, data, { headers: { authorization: "Bearer " + token } });
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

export async function DeleteRequest(path: string, data: JSON) {
	const token = localStorage.getItem("token");
	let res: Response;
	try { 
		const response = await axios.delete(server_url + path, { headers: { authorization: "Bearer " + token } });
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
