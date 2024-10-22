import type Album from "@/interfaces/Album.tsx";
import axios from "axios";
import type { Dispatch, SetStateAction } from "react";

const ImageToAlbum = async (
	image: string,
	setScannedAlbum: Dispatch<SetStateAction<Album | null>>,
) => {
	axios
		.post(
			`${import.meta.env.VITE_BFF_ADDRESS}image_to_album/`,
			{ image: image },
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

export default ImageToAlbum;
