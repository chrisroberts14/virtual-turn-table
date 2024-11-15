import { getNotifications } from "@/api_calls/BFFEndpoints";
import axios from "axios";

const GetNotifications = async (username: string) => {
	try {
		const response = await axios.get(`${getNotifications}/${username}`);
		return response.data;
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			throw new Error(error.response?.data?.message || "An error occurred");
		}
		throw new Error("An unexpected error occurred");
	}
};

export default GetNotifications;
