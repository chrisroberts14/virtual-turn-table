import type Album from "@/interfaces/Album.tsx";
import axios from "axios";
import type { Dispatch, SetStateAction } from "react";

const GetAlbumDetails = async (
	albumURI: string,
	accessToken: string,
	setCurrentAlbum: Dispatch<SetStateAction<Album | null>>,
) => {
	axios
		.get(`${import.meta.env.VITE_BFF_ADDRESS}album_details/`, {
			params: {
				spotify_access_token: accessToken,
				album_uri: albumURI,
			},
		})
		.then((response) => {
			const album: Album = response.data;
			setCurrentAlbum({
				title: album.title,
				artists: album.artists,
				image_url: album.image_url,
				album_uri: album.album_uri,
				tracks_url: album.tracks_url,
				songs: album.songs,
			});
		})
		.catch((error) => {
			throw new Error(error.response.data.message);
		});
};

export default GetAlbumDetails;
