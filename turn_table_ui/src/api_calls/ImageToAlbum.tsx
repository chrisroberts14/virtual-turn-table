import { imageToAlbum } from "@/api_calls/BFFEndpoints.tsx";
import axios from "axios";

const ImageToAlbum = async (image: string) => {
	try {
		const response = await axios.post(
			imageToAlbum,
			{ image: image },
			{
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		return response.data;
	} catch (error: unknown) {
		// Check if the error is an AxiosError (has a response)
		if (axios.isAxiosError(error)) {
			// Handle Axios errors (network errors)
			throw new Error(error.response?.data?.message || "An error occurred");
		}
		// Handle non-Axios errors (e.g., programming errors)
		throw new Error("An unexpected error occurred");
	}
};

export default ImageToAlbum;
