import GetAlbumDetails from "@/api_calls/GetAlbumDetails.tsx";
import GetUserAlbums from "@/api_calls/GetUserAlbums.tsx";
import { useError } from "@/contexts/ErrorContext.tsx";
import { useSpotifyToken } from "@/contexts/SpotifyTokenContext.tsx";
import { useUsername } from "@/contexts/UsernameContext.tsx";
import type Album from "@/interfaces/Album.tsx";
import { Image } from "@nextui-org/image";
import { useEffect, useState } from "react";

const AlbumCollectionDisplay = () => {
	const { username } = useUsername();
	const [albums, setAlbums] = useState<Album[]>([]);
	const { showError } = useError();
	const { token } = useSpotifyToken();

	useEffect(() => {
		// Get the users album collection
		if (username && token) {
			GetUserAlbums(username)
				.then((albums) => {
					if (albums) {
						// Get all album details and create a list of them
						const albumPromises = albums.map((album_uri: string) => {
							return GetAlbumDetails(album_uri, token);
						});

						const fetchAllAlbumDetails = async () => {
							const albumDetails = await Promise.all(albumPromises);
							setAlbums(albumDetails);
						};
						fetchAllAlbumDetails().then(() => {
							return;
						});
					}
				})
				.catch((error) => {
					showError(error.message);
				});
		}
	}, [username, token, showError]);

	return (
		<div className="flex h-full w-full">
			{albums.map((album) => (
				<div
					key={album.album_uri}
					className="flex-shrink-0 h-full w-auto m-2 overflow-x-auto"
				>
					<Image
						className="rounded-lg h-full object-cover" // Use h-full to make it fill the parent's height and object-cover to maintain aspect ratio
						src={album.image_url}
						alt="album cover"
						shadow="md"
						width={150} // Width can remain as is
						height={150} // Optional: specify height for consistent aspect ratio
					/>
				</div>
			))}
		</div>
	);
};

export default AlbumCollectionDisplay;
