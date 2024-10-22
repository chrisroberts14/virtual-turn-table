import { addAlbum } from "@/api_calls/BFFEndpoints";
import axios from "axios";

const AddAlbum = (username: string, albumURI: string) => {
	axios
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
};

export default AddAlbum;
