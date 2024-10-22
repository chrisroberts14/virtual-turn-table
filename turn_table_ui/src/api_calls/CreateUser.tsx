import { createUser } from "@/api_calls/BFFEndpoints.tsx";
import axios from "axios";

const CreateUser = async (username: string, email: string) => {
	axios
		.post(
			createUser,
			{ username: username, email: email },
			{
				headers: {
					"Content-Type": "application/json",
				},
			},
		)
		.catch((error) => {
			throw new Error(error.response.data.message);
		});
};

export default CreateUser;
