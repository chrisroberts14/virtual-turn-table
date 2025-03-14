import GetAlbumDetails from "@/api_calls/GetAlbumDetails";
import GetUserAlbums from "@/api_calls/GetUserAlbums";
import Collection from "@/components/Collection";
import { useAlbumSelection } from "@/contexts/AlbumSelectionContext";
import { useBFFToken } from "@/contexts/BFFTokenContext.ts";
import { CollectionContext } from "@/contexts/CollectionContext";
import { useError } from "@/contexts/ErrorContext";
import { useMusic } from "@/contexts/MusicContext";
import { useUsername } from "@/contexts/UsernameContext";
import type Album from "@/interfaces/Album";
import type { Collection as CollectionType } from "@/interfaces/Collection";
import eventEmitter from "@/utils/EventEmitter";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { useCallback, useEffect, useState } from "react";

interface AlbumCollectionDisplayProps {
	albumCollection?: CollectionType;
	orientation?: "horizontal" | "vertical";
}

const AlbumCollectionDisplay = ({
	albumCollection,
	orientation = "horizontal",
}: AlbumCollectionDisplayProps) => {
	const { username } = useUsername();
	const { showError } = useError();
	const { BFFToken } = useBFFToken();
	const { setCurrentAlbum } = useMusic();
	const { albums, setAlbums, setHoveredAlbum } = useAlbumSelection();

	const userAlbumUpdate = useCallback(
		(user: string) => {
			if (albumCollection) {
				// Show the albums handed to the component
				setAlbums(albumCollection.albums);
				return;
			}
			if (user && BFFToken) {
				// Show the currently logged-in users albums
				GetUserAlbums(user, BFFToken)
					.then((albums) => {
						if (albums.length > 0) {
							// Get all album details and create a list of them
							const albumPromises = albums.map((album_uri: string) => {
								return GetAlbumDetails(album_uri, BFFToken);
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
		},
		[BFFToken, setAlbums, albumCollection],
	);

	useEffect(() => {
		eventEmitter.on("albumAdded", () => {
			if (username) userAlbumUpdate(username);
		});
		// Get the users album collection
		if (username) {
			userAlbumUpdate(username);
		}
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

	const [isCollectionOpen, setIsCollectionOpen] = useState(false);

	const toggleOpen = () => {
		setIsCollectionOpen(!isCollectionOpen);
	};

	return (
		<div
			className={`${orientation === "vertical" ? "flex-col" : ""} flex max-h-full w-full overflow-auto bg-gray-900 rounded-2xl`}
		>
			<CollectionContext.Provider
				value={{
					username: username,
					albums: albums,
					setAlbums: () => {},
					isCollectionOpen: isCollectionOpen,
					setIsCollectionOpen: setIsCollectionOpen,
				}}
			>
				<Button onPress={toggleOpen}>Open Modal</Button>
				<Collection />
			</CollectionContext.Provider>
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
