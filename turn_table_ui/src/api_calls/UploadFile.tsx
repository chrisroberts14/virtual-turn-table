import { imageToAlbum } from "@/api_calls/BFFEndpoints.tsx";
import type Album from "@/interfaces/Album.tsx";
import axios from "axios";
import type { Dispatch, SetStateAction } from "react";

const UploadFile = async (
	file: File,
	setScannedAlbum: Dispatch<SetStateAction<Album | null>>,
) => {
	const convertToBase64 = (file: File) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	};

	const base64 = await convertToBase64(file);
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
			const newAlbum: Album = response.data;
			setScannedAlbum(newAlbum);
		})
		.catch((error) => {
			throw new Error(error.response.data.message);
		});
};

export default UploadFile;
