import { auth } from "@/api_calls/BFFEndpoints";
import axios from "axios";

const getToken = async (spotify_auth_token: string) => {
	// Return the string token
	return await axios
		.post(auth, null, {
			params: {
				spotify_access_token: spotify_auth_token,
			},
		})
		.then((response) => {
			return response.data.access_token;
		})
		.catch((error) => {
			throw new Error(error.response.data.message);
		});
};

export default getToken;
