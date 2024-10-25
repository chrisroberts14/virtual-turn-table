import { createUser } from "@/api_calls/BFFEndpoints.tsx";
import axios from "axios";

const CreateUser = async (username: string, email: string) => {
	return axios
		.post(
			createUser,
			{ username: username, email: email },
			{
				headers: {
					"Content-Type": "application/json",
				},
			},
		)
		.catch((_) => {
			throw new Error("Failed to collect user information from database");
		});
};

export default CreateUser;
