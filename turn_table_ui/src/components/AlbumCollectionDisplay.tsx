import GetAlbumDetails from "@/api_calls/GetAlbumDetails.tsx";
import GetUserAlbums from "@/api_calls/GetUserAlbums.tsx";
import { useAlbumSelection } from "@/contexts/AlbumSelectionContext.tsx";
import { useError } from "@/contexts/ErrorContext.tsx";
import { useMusic } from "@/contexts/MusicContext.tsx";
import { useSpotifyToken } from "@/contexts/SpotifyTokenContext.tsx";
import { useUsername } from "@/contexts/UsernameContext.tsx";
import type Album from "@/interfaces/Album.tsx";
import type Collection from "@/interfaces/Collection.tsx";
import eventEmitter from "@/utils/EventEmitter.ts";
import { Image } from "@nextui-org/image";
import { useCallback, useEffect } from "react";

interface AlbumCollectionDisplayProps {
	albumCollection?: Collection;
	orientation?: "horizontal" | "vertical";
}

const AlbumCollectionDisplay = ({
	albumCollection,
	orientation = "horizontal",
}: AlbumCollectionDisplayProps) => {
	const { username } = useUsername();
	const { showError } = useError();
	const { token } = useSpotifyToken();
	const { setCurrentAlbum } = useMusic();
	const { albums, setAlbums, setHoveredAlbum } = useAlbumSelection();

	const userAlbumUpdate = useCallback(
		(user: string) => {
			if (user && token && albumCollection) {
				// Show the currently logged-in users albums
				GetUserAlbums(user)
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
			} else if (albumCollection) {
				// Show the albums handed to the component
				setAlbums(albumCollection.albums);
			}
		},
		[token, setAlbums, albumCollection],
	);

	useEffect(() => {
		eventEmitter.on("albumAdded", () => {
			if (username) userAlbumUpdate(username);
		});
		// Get the users album collection
		if (username) {
			userAlbumUpdate(username);
		}

		return () => {
			eventEmitter.off("albumAdded", () => {
				if (username) userAlbumUpdate(username);
			});
		};
	}, [username, userAlbumUpdate]);

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
		<div
			className={`${orientation === "vertical" ? "flex-col" : ""} flex max-h-full w-full overflow-auto bg-gray-900 rounded-2xl`}
		>
			{albums.map((album) => (
				<div
					key={album.album_uri}
					className="flex-shrink-0 m-2 transition-transform duration-300 transform hover:scale-105"
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
