import GetAlbumDetails from "@/api_calls/GetAlbumDetails.ts";
import GetUserAlbums from "@/api_calls/GetUserAlbums.ts";
import AlbumConfirm from "@/components/AlbumConfirm.tsx";
import { CollectionPreviewHorizontal } from "@/components/CollectionPreview.tsx";
import ImageCapture from "@/components/ImageCapture.tsx";
import { CollectionContext } from "@/contexts/CollectionContext.tsx";
import { useSpotifyToken } from "@/contexts/SpotifyTokenContext.tsx";
import { UploadContext } from "@/contexts/UploadContext.tsx";
import { useUsername } from "@/contexts/UsernameContext.tsx";
import { useWebSocket } from "@/contexts/WebSocketContext.ts";
import useResizeHandler from "@/hooks/UseResizeHandler.tsx";
import type Album from "@/interfaces/Album.tsx";
import { Resizable } from "re-resizable";
import { useEffect, useState } from "react";

const ScanPage = () => {
	const [isUploading, setIsUploading] = useState(false);
	const [scannedAlbum, setScannedAlbum] = useState<Album | null>(null);
	const [fadeConfirm, setFadeConfirm] = useState(false);
	const [currentImage, setCurrentImage] = useState<string | null>(null);
	const [top10, setTop10] = useState<Album[]>([]);
	const contentHeight = useResizeHandler(240);
	const [albums, setAlbums] = useState<Album[] | undefined>(undefined);
	const { username } = useUsername();
	const { token } = useSpotifyToken();
	const { ws } = useWebSocket();

	useEffect(() => {
		if (username && token) {
			updateAlbums();
		}
	}, [username, token]);

	useEffect(() => {
		if (ws) {
			ws.onmessage = (event) => {
				const data = JSON.parse(event.data);
				if (data.message === "Album added") {
					updateAlbums();
				}
			};
		}
	}, [ws]);

	const updateAlbums = () => {
		if (username && token) {
			GetUserAlbums(username).then((albums) => {
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
			});
		}
	};

	return (
		<UploadContext.Provider
			value={{
				isUploading,
				setIsUploading,
				scannedAlbum,
				setScannedAlbum,
				fadeConfirm,
				setFadeConfirm,
				currentImage,
				setCurrentImage,
				top10,
				setTop10,
			}}
		>
			<div className="flex flex-col h-screen">
				<Resizable
					defaultSize={{ width: "100%" }}
					maxHeight={contentHeight}
					minHeight={contentHeight}
					enable={{
						top: false,
						right: false,
						bottom: false,
						left: false,
						topRight: false,
						bottomRight: false,
						bottomLeft: false,
						topLeft: false,
					}}
				>
					<div className="flex flex-row h-full">
						<Resizable
							enable={{
								top: false,
								right: true,
								bottom: false,
								left: false,
								topRight: false,
								bottomRight: false,
								bottomLeft: false,
								topLeft: false,
							}}
							maxHeight={"100%"}
							style={{
								transition: "width 0.5s ease-in-out",
								overflow: "hidden", // Hide content when collapsed
							}}
							size={{
								width: fadeConfirm ? "100%" : "0%", // Resizes based on the state
							}}
							className="bg-gray-700 sm:max-w-[25%]"
						>
							<div className="overflow-y-auto h-full max-h-full">
								<AlbumConfirm />
							</div>
						</Resizable>
						<ImageCapture />
					</div>
				</Resizable>
				<div className="flex h-full bg-gray-900 w-screen p-1 overflow-x-hidden">
					<CollectionContext.Provider
						value={{
							albums: albums,
							setAlbums: () => {},
							isCollectionOpen: false,
							setIsCollectionOpen: () => {},
							username: username,
						}}
					>
						<CollectionPreviewHorizontal />
					</CollectionContext.Provider>
				</div>
			</div>
		</UploadContext.Provider>
	);
};

export default ScanPage;
