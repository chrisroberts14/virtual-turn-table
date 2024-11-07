import GetPublicCollections from "@/api_calls/GetPublicCollections.tsx";
import GetSharedCollections from "@/api_calls/GetSharedCollections.tsx";
import AlbumCollectionDisplay from "@/components/AlbumCollectionDisplay.tsx";
import { AlbumSelectionContext } from "@/contexts/AlbumSelectionContext.tsx";
import { useSpotifyToken } from "@/contexts/SpotifyTokenContext.tsx";
import { useUsername } from "@/contexts/UsernameContext.tsx";
import useResizeHandler from "@/hooks/UseResizeHandler.tsx";
import type Collection from "@/interfaces/Collection.tsx";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Skeleton } from "@nextui-org/skeleton";
import { Resizable } from "re-resizable";
import { useEffect } from "react";
import { useState } from "react";

const SocialPage = () => {
	const [publicCollections, setPublicCollections] = useState<Collection[]>([]);
	const [sharedCollections, setSharedCollections] = useState<Collection[]>([]);
	const { token } = useSpotifyToken();
	const { username } = useUsername();
	const contentHeight = useResizeHandler(64);

	useEffect(() => {
		if (!token || !username) {
			return;
		}
		fetchCollections().then(
			(value: { pub: Collection[]; shar: Collection[] } | null) => {
				if (!value) {
					return;
				}
				setPublicCollections(value.pub);
				setSharedCollections(value.shar);
			},
		);
	}, [token, username]);

	const fetchCollections = async () => {
		if (!token || !username) {
			return null;
		}
		const publicCollectionsResult: Collection[] =
			await GetPublicCollections(token);
		const sharedCollectionsResult: Collection[] = await GetSharedCollections(
			username,
			token,
		);
		return { pub: publicCollectionsResult, shar: sharedCollectionsResult };
	};

	return (
		<div
			className="flex w-screen bg-gray-700"
			style={{ height: contentHeight }}
		>
			<Resizable
				className="text-left p-2 pb-8"
				minWidth="20%"
				maxWidth="80%"
				minHeight="100%"
				defaultSize={{ width: "50%", height: "100%" }}
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
			>
				<header className="font-bold text-xl pb-2">Public Collections</header>
				{publicCollections.length === 0 ? (
					<Skeleton className="rounded-2xl h-full">
						<div className="h-full" />
					</Skeleton>
				) : (
					<div className="overflow-x-auto flex space-x-2 h-full justify-start">
						{
							/* Add a list of public collections here */
							publicCollections.map((collection) => {
								return (
									<AlbumSelectionContext.Provider
										value={{
											albums: collection.albums,
											setAlbums: () => {},
											hoveredAlbum: null,
											setHoveredAlbum: () => {},
										}}
										key={`${collection.user_id} - public`}
									>
										<Card className="bg-gray-900 min-w-max">
											<CardHeader>
												<span className="font-bold text-lg text-wrap text-center w-full">
													{collection.user_id}
												</span>
											</CardHeader>
											<CardBody className="overflow-y-auto">
												<AlbumCollectionDisplay orientation="vertical" />
											</CardBody>
										</Card>
									</AlbumSelectionContext.Provider>
								);
							})
						}
					</div>
				)}
			</Resizable>
			<div className="pb-8 text-right p-2 border-l-5 border-black min-w-[20%] w-full justify-end">
				<header className="font-bold text-xl pb-2">Shared With You</header>
				{sharedCollections.length === 0 ? (
					<Skeleton className="rounded-2xl h-full">
						<div className="h-full" />
					</Skeleton>
				) : (
					<div
						className="overflow-x-auto flex space-x-reverse space-x-2 h-full"
						style={{ direction: "rtl" }}
					>
						{
							/* Add a list of shared collections here */
							sharedCollections.map((collection) => {
								return (
									<AlbumSelectionContext.Provider
										value={{
											albums: collection.albums,
											setAlbums: () => {},
											hoveredAlbum: null,
											setHoveredAlbum: () => {},
										}}
										key={`${collection.user_id} - shared`}
									>
										<Card className="bg-gray-900 min-w-max">
											<CardHeader>
												<span className="font-bold text-lg text-wrap text-center w-full">
													{collection.user_id}
												</span>
											</CardHeader>
											<CardBody className="overflow-y-auto">
												<AlbumCollectionDisplay orientation="vertical" />
											</CardBody>
										</Card>
									</AlbumSelectionContext.Provider>
								);
							})
						}
					</div>
				)}
			</div>
		</div>
	);
};

export default SocialPage;
