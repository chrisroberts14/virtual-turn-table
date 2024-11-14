import GetPublicCollections from "@/api_calls/GetPublicCollections";
import GetSharedCollections from "@/api_calls/GetSharedCollections";
import AlbumCollectionDisplay from "@/components/AlbumCollectionDisplay";
import { AlbumSelectionContext } from "@/contexts/AlbumSelectionContext";
import { useError } from "@/contexts/ErrorContext";
import { useSpotifyToken } from "@/contexts/SpotifyTokenContext";
import { useUsername } from "@/contexts/UsernameContext";
import useResizeHandler from "@/hooks/UseResizeHandler";
import type { Collection } from "@/interfaces/Collection";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Skeleton } from "@nextui-org/skeleton";
import { Spinner } from "@nextui-org/spinner";
import { Resizable } from "re-resizable";
import { useEffect } from "react";
import { useState } from "react";

const SocialPage = () => {
	const [publicCollections, setPublicCollections] = useState<
		Collection[] | null
	>([]);
	const [sharedCollections, setSharedCollections] = useState<
		Collection[] | null
	>([]);
	const { token } = useSpotifyToken();
	const { username } = useUsername();
	const contentHeight = useResizeHandler(64);
	const { showError } = useError();

	useEffect(() => {
		if (!token || !username) {
			return;
		}
		fetchCollections().then(
			(value: { pub: Collection[]; shar: Collection[] } | null) => {
				if (!value) {
					showError("Failed to fetch collections");
					return;
				}
				setPublicCollections(value.pub);
				setSharedCollections(value.shar);
				if (value.pub.length === 0) {
					setPublicCollections(null);
				}
				if (value.shar.length === 0) {
					setSharedCollections(null);
				}
			},
		);
	}, [token, username, showError]);

	const fetchCollections = async () => {
		const publicCollectionsResult: Collection[] = await GetPublicCollections(
			token,
		).catch(() => {
			return null;
		});
		const sharedCollectionsResult: Collection[] = await GetSharedCollections(
			username,
			token,
		).catch(() => {
			return null;
		});
		if (publicCollectionsResult === null || !sharedCollectionsResult === null) {
			return null;
		}
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
				{publicCollections === null ||
				(publicCollections.length === 1 &&
					publicCollections[0].user_id === username) ? (
					<div className="h-full w-full text-center content-center">
						<span className="text-xl font-extrabold">
							There are no public collections
						</span>
					</div>
				) : publicCollections?.length === 0 ? (
					<Skeleton className="rounded-2xl h-full">
						<div className="h-full">
							<Spinner />
						</div>
					</Skeleton>
				) : (
					<div className="overflow-x-auto flex space-x-2 h-full justify-start">
						{
							/* Add a list of public collections here */
							publicCollections?.map((collection) => {
								if (
									collection.user_id === username ||
									collection.albums.length === 0
								) {
									return null;
								}
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
				{sharedCollections === null ? (
					<div className="h-full w-full text-center content-center">
						{" "}
						<span className="text-xl font-extrabold">
							You have no shared collections
						</span>{" "}
					</div>
				) : sharedCollections?.length === 0 ? (
					<Skeleton className="rounded-2xl h-full">
						<div className="h-full">
							<Spinner />
						</div>
					</Skeleton>
				) : (
					<div
						className="overflow-x-auto flex space-x-reverse space-x-2 h-full"
						style={{ direction: "rtl" }}
					>
						{
							/* Add a list of shared collections here */
							sharedCollections?.map((collection) => {
								if (
									collection.user_id === username ||
									collection.albums.length === 0
								) {
									return null;
								}
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
