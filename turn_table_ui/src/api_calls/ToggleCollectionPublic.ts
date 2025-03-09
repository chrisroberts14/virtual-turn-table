import { toggleCollectionPublic } from "@/api_calls/BFFEndpoints";
import axios from "axios";

const ToggleCollectionPublic = async (authToken: string) => {
	return await axios
		.put(
			toggleCollectionPublic,
			{},
			{
				headers: {
					Authorization: `Bearer ${authToken}`,
				},
			},
		)
		.catch((error) => {
			throw new Error(error.response.data.message);
		});
};

export default ToggleCollectionPublic;
