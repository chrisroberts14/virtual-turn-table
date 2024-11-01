import { createUser } from "@/api_calls/BFFEndpoints.tsx";
import axios from "axios";

const CreateUser = async (username: string, email: string) => {
	try {
		const response = await axios.post(
			createUser,
			{ username: username, email: email },
			{
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		return response.data;
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			throw new Error(error.response?.data?.message || "An error occurred");
		}
		throw new Error("An unexpected error occurred");
	}
};

export default CreateUser;
