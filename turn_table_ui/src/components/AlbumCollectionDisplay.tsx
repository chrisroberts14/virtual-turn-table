import GetAlbumDetails from "@/api_calls/GetAlbumDetails.tsx";
import GetUserAlbums from "@/api_calls/GetUserAlbums.tsx";
import { useAlbumSelection } from "@/contexts/AlbumSelectionContext.tsx";
import { useError } from "@/contexts/ErrorContext.tsx";
import { useMusic } from "@/contexts/MusicContext.tsx";
import { useSpotifyToken } from "@/contexts/SpotifyTokenContext.tsx";
import { useUpload } from "@/contexts/UploadContext.tsx";
import { useUsername } from "@/contexts/UsernameContext.tsx";
import type Album from "@/interfaces/Album.tsx";
import { Image } from "@nextui-org/image";
import { useEffect } from "react";

const AlbumCollectionDisplay = () => {
	const { username } = useUsername();
	const { showError } = useError();
	const { token } = useSpotifyToken();
	const { setCurrentAlbum } = useMusic();
	const { albums, setAlbums, setHoveredAlbum } = useAlbumSelection();
	const { scannedAlbum } = useUpload();

	useEffect(() => {
		// Get the users album collection
		if (username && token) {
			GetUserAlbums(username)
				.then((albums) => {
					if (albums.length > 0) {
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
					displayError(error.message);
				});
		}
	}, [username, token, setAlbums]);

	const displayError = (error: string) => {
		showError(error);
	};

	const handleClick = (album: Album) => {
		setCurrentAlbum(album);
	};

	const handleMouseOver = (album: Album) => {
		setHoveredAlbum(album);
	};

	return (
		<div className="flex h-full w-full overflow-y-hidden overflow-x-auto bg-gray-900">
			{albums.map((album) => (
				<div
					key={album.album_uri}
					className="flex-shrink-0 h-full w-auto m-2 transition-transform duration-300 transform hover:scale-110"
					onClick={() => handleClick(album)}
					onMouseOver={() => handleMouseOver(album)}
					onFocus={() => handleMouseOver(album)}
					onMouseOut={() => setHoveredAlbum(null)}
					onBlur={() => setHoveredAlbum(null)}
					onKeyDown={() => handleClick(album)}
				>
					<Image
						className="rounded-lg h-full object-cover"
						src={album.image_url}
						alt={album.title}
						shadow="md"
						width={150}
						height={150}
					/>
				</div>
			))}
		</div>
	);
};

export default AlbumCollectionDisplay;
