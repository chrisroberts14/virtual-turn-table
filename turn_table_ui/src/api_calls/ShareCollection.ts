import { shareCollection } from "@/api_calls/BFFEndpoints";
import axios from "axios";

const ShareCollection = async (authToken: string, receiver: string) => {
	return await axios
		.post(
			shareCollection,
			{
				receiver: receiver,
			},
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authToken}`,
				},
			},
		)
		.catch((error) => {
			throw new Error(error.response.data.message);
		});
};

export default ShareCollection;
