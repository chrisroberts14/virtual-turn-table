import { addAlbum } from "@/api_calls/BFFEndpoints";
import eventEmitter from "@/utils/EventEmitter";
import axios from "axios";

const AddAlbum = async (authToken: string, albumURI: string) => {
	// Call to add album to user's library
	const result = await axios
		.post(
			addAlbum,
			{
				album_uri: albumURI,
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
	eventEmitter.emit("albumAdded");
	return result;
};

export default AddAlbum;
