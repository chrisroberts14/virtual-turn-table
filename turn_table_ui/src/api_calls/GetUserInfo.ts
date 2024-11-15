import { userInfo } from "@/api_calls/BFFEndpoints";
import axios from "axios";

const GetUserInfo = async (token: string | undefined) => {
	// Call to get user's information from Spotify
	try {
		const response = await axios.get(userInfo, {
			params: {
				spotify_access_token: token,
			},
		});
		return response.data;
	} catch (error: unknown) {
		// Check if the error is an AxiosError (has a response)
		if (axios.isAxiosError(error)) {
			// Handle Axios errors (network errors)
			throw new Error(error.response?.data?.message || "An error occurred");
		}
		// Handle non-Axios errors (e.g., programming errors)
		throw new Error("An unexpected error occurred");
	}
};

export default GetUserInfo;
