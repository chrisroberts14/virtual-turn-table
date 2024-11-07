import { shareCollection } from "@/api_calls/BFFEndpoints.tsx";
import axios from "axios";

const ShareCollection = async (sharer: string, receiver: string) => {
	return await axios
		.post(
			shareCollection,
			{
				sharer: sharer,
				receiver: receiver,
			},
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

export default ShareCollection;
