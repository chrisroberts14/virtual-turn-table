import { albumDetails } from "@/api_calls/BFFEndpoints";
import axios from "axios";

const GetAlbumDetails = async (albumURI: string, accessToken: string) => {
	// Call to get album details
	// accessToken is the access token for the BFF
	try {
		const response = await axios.get(albumDetails, {
			params: {
				album_id: albumURI,
			},
			headers: {
				Authorization: `Bearer ${accessToken}`,
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
