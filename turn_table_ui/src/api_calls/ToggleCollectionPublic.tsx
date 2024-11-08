import { toggleCollectionPublic } from "@/api_calls/BFFEndpoints.tsx";
import axios from "axios";

const ToggleCollectionPublic = async (username: string) => {
	return await axios
		.put(`${toggleCollectionPublic}/${username}`)
		.catch((error) => {
			throw new Error(error.response.data.message);
		});
};

export default ToggleCollectionPublic;
