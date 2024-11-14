import { imageToAlbum } from "@/api_calls/BFFEndpoints";
import type Album from "@/interfaces/Album";
import axios from "axios";
import type { Dispatch, SetStateAction } from "react";

const UploadFile = async (
	file: File,
	setScannedAlbum: Dispatch<SetStateAction<Album | null>>,
) => {
	const convertToBase64 = (file: File) => {
		// Image needs to be converted to base64 to be sent to the backend
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	};

	const base64 = await convertToBase64(file);
	// Call to convert an image into an album
	await axios
		.post(
			imageToAlbum,
			{ image: base64 },
			{
				headers: {
					"Content-Type": "application/json",
				},
			},
		)
		.then((response) => {
			// Success set the scanned album
			const newAlbum: Album = response.data;
			setScannedAlbum(newAlbum);
		})
		.catch((error) => {
			// Throw an error if the request fails
			throw new Error(error.response.data.message);
		});
};

export default UploadFile;
