import { getUserAlbums } from "@/api_calls/BFFEndpoints.tsx";
import axios from "axios";

const GetUserAlbums = async (username: string) => {
	// Call to get user's albums
	try {
		const response = await axios.get(`${getUserAlbums}${username}`);
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

export default GetUserAlbums;
