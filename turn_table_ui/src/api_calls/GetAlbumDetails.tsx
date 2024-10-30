import { albumDetails } from "@/api_calls/BFFEndpoints.tsx";
import axios from "axios";

const GetAlbumDetails = async (albumURI: string, accessToken: string) => {
	try {
		const response = await axios.get(albumDetails, {
			params: {
				spotify_access_token: accessToken,
				album_uri: albumURI,
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
