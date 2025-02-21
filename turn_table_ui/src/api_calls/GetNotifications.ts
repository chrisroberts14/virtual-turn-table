import { getNotifications } from "@/api_calls/BFFEndpoints";
import axios from "axios";

const GetNotifications = async (authToken: string) => {
	try {
		const response = await axios.get(`${getNotifications}`, {
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
		});
		return response.data;
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			throw new Error(error.response?.data?.message || "An error occurred");
		}
		throw new Error("An unexpected error occurred");
	}
};

export default GetNotifications;
