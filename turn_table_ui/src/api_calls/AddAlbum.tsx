import { addAlbum } from "@/api_calls/BFFEndpoints";
import eventEmitter from "@/utils/EventEmitter.ts";
import axios from "axios";

const AddAlbum = async (username: string, albumURI: string) => {
	const result = await axios
		.post(
			addAlbum,
			{
				user_id: username,
				album_uri: albumURI,
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
	eventEmitter.emit("albumAdded");
	return result;
};

export default AddAlbum;
