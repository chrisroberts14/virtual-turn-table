import { getUsersBySearch } from "@/api_calls/BFFEndpoints";
import axios from "axios";

const GetUsersBySearch = async (query: string) => {
	try {
		const response = await axios.get(getUsersBySearch, {
			params: {
				query: query,
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

export default GetUsersBySearch;
