import { albumDetails } from "@/api_calls/BFFEndpoints";
import axios from "axios";

const GetAlbumDetails = async (albumURI: string, accessToken: string) => {
	// Call to get album details
	try {
		const response = await axios.get(albumDetails, {
			params: {
				spotify_access_token: accessToken,
				album_id: albumURI,
			},
		});
		return response.data;
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			throw new Error(error.response?.data?.message || "An error occurred");
		}
		throw new Error("An unexpected error occurred");
	}
};

export default GetAlbumDetails;
