import GetPublicCollections from "@/api_calls/GetPublicCollections";
import GetSharedCollections from "@/api_calls/GetSharedCollections";
import { CollectionPreviewVertical } from "@/components/CollectionPreview.tsx";
import { useBFFToken } from "@/contexts/BFFTokenContext.ts";
import { CollectionContext } from "@/contexts/CollectionContext.tsx";
import { useError } from "@/contexts/ErrorContext";
import { useUsername } from "@/contexts/UsernameContext";
import useResizeHandler from "@/hooks/UseResizeHandler";
import type { Collection } from "@/interfaces/Collection";
import eventEmitter from "@/utils/EventEmitter";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import { Spinner } from "@heroui/spinner";
import { useEffect } from "react";
import { useState } from "react";

const SocialPage = () => {
	const [publicCollections, setPublicCollections] = useState<
		Collection[] | null
	>(null);
	const [sharedCollections, setSharedCollections] = useState<
		Collection[] | null
	>(null);
	const { BFFToken } = useBFFToken();
	const { username } = useUsername();
	const contentHeight = useResizeHandler(64);
	const { showError } = useError();
	const [publicOffset, setPublicOffset] = useState(0);
	const [sharedOffset, setSharedOffset] = useState(0);
	const [isPublicLoading, setIsPublicLoading] = useState(false);
	const [isSharedLoading, setIsSharedLoading] = useState(false);
	const [isPublicEnd, setIsPublicEnd] = useState(false);
	const [isSharedEnd, setIsSharedEnd] = useState(false);
	const [limit, setLimit] = useState(10);

	useEffect(() => {
		if (!BFFToken || !username) {
			return;
		}
		// The limit is set based on the width of the screen
		if (window.innerWidth < 768) {
			setLimit(5);
		} else {
			setLimit(11);
		}
		fetchPublicCollections().catch(() => {
			showError("Failed to fetch public collections");
		});
		fetchSharedCollections().catch(() => {
			showError("Failed to fetch shared collections");
		});

		eventEmitter.on("refresh-social", () => {
			fetchSharedCollections().catch(() => {
				showError("Failed to fetch shared collections");
			});
		});
	}, [BFFToken, username, showError]);

	const fetchPublicCollections = async () => {
		setIsPublicLoading(true);
		const publicCollectionsResult: Collection[] | undefined | null =
			await GetPublicCollections(publicOffset, limit, BFFToken)
				.then((result: Collection[] | null | undefined) => {
					setPublicOffset(publicOffset + limit);
					if (result === null || result === undefined) {
						showError("Failed to fetch public collections");
						return;
					}
					if (result.length < limit || result.length === 0) {
						setIsPublicEnd(true);
					}
					// Filter out the collections that are owned by the user
					const filteredResult = result.filter(
						(collection) => collection.user_id !== username,
					);

					// Append the new collections to the existing collections
					if (publicCollections === null) {
						setPublicCollections(filteredResult);
					} else {
						setPublicCollections([...publicCollections, ...filteredResult]);
					}
					return result;
				})
				.catch(() => {
					throw null;
				});
		if (
			publicCollectionsResult === null ||
			publicCollectionsResult === undefined
		) {
			return null;
		}
		setIsPublicLoading(false);
		return publicCollectionsResult;
	};

	const fetchSharedCollections = async () => {
		setIsSharedLoading(true);
		if (BFFToken === null) {
			showError("Failed to fetch shared collections");
			return;
		}
		const sharedCollectionsResult: Collection[] = await GetSharedCollections(
			sharedOffset,
			limit,
			username,
			BFFToken,
		)
			.then((result) => {
				setSharedOffset(sharedOffset + limit);
				if (result === null) {
					showError("Failed to fetch shared collections");
					return;
				}
				if (result.length < limit || result.length === 0) {
					setIsSharedEnd(true);
				}
				// Append the new collections to the existing collections
				if (sharedCollections === null) {
					setSharedCollections(result);
				} else {
					setSharedCollections([...sharedCollections, ...result]);
				}
				return result;
			})
			.catch(() => {
				return null;
			});
		if (sharedCollectionsResult === null) {
			return null;
		}
		setIsSharedLoading(false);
		return sharedCollectionsResult;
	};

	return (
		<div
			className="flex w-screen bg-gray-700"
			style={{ height: contentHeight }}
		>
			<div className="w-[50%] p-2">
				<header className="font-bold text-xl pb-2">Public Collections</header>
				{publicCollections?.length === 0 ||
				publicCollections === null ||
				(publicCollections.length === 1 &&
					publicCollections[0].user_id === username) ? (
					<div className="h-full w-full text-center content-center">
						<span className="text-xl font-extrabold">
							There are no public collections
						</span>
					</div>
				) : isPublicLoading ? (
					<Skeleton className="rounded-2xl h-full">
						<div className="h-full">
							<Spinner />
						</div>
					</Skeleton>
				) : (
					<>
						<div className="overflow-x-auto flex flex-wrap justify-start gap-2 h-[90%]">
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
										<Card
											className="bg-gray-900 w-[132px] h-[240px]"
											key={`${collection.user_id} - private`}
										>
											<CardHeader>
												<span className="font-bold text-lg text-nowrap text-center w-full">
													{collection.user_id}
												</span>
											</CardHeader>
											<CardBody className="overflow-y-hidden">
												<CollectionContext.Provider
													value={{
														albums: collection.albums,
														setAlbums: () => {},
														isCollectionOpen: false,
														setIsCollectionOpen: () => {},
														username: collection.user_id,
													}}
												>
													<CollectionPreviewVertical />
												</CollectionContext.Provider>
											</CardBody>
										</Card>
									);
								})
							}
						</div>
						<div className="w-full text-center h-[7%] content-center">
							<Button
								className="max-w-[25%]"
								onPress={fetchPublicCollections}
								isLoading={isPublicLoading}
								isDisabled={isPublicEnd}
							>
								{!isPublicEnd ? "Load More" : "No more collections"}
							</Button>
						</div>
					</>
				)}
			</div>
			<div className="text-right border-l-5 border-black w-[50%] justify-end p-2 flex-wrap">
				<header className="font-bold text-xl pb-2">Shared With You</header>
				{sharedCollections?.length === 0 ? (
					<div className="h-full w-full text-center content-center">
						{" "}
						<span className="text-xl font-extrabold">
							You have no shared collections
						</span>{" "}
					</div>
				) : sharedCollections === null ? (
					<Skeleton className="rounded-2xl h-full">
						<div className="h-full">
							<Spinner />
						</div>
					</Skeleton>
				) : (
					<>
						<div
							className="overflow-x-auto flex flex-wrap gap-2 h-[90%]"
							style={{ direction: "rtl" }}
						>
							{
								/* Add a list of shared collections here */
								sharedCollections?.map((collection) => {
									let isCollectionOpen = false;
									const setIsCollectionOpen = (value: boolean) => {
										isCollectionOpen = value;
									};
									if (
										collection.user_id === username ||
										collection.albums.length === 0
									) {
										return null;
									}
									return (
										<Card
											className="bg-gray-900 min-w-max w-[132px] h-[240px]"
											key={`${collection.user_id} - public`}
										>
											<CardHeader>
												<span className="font-bold text-lg text-wrap text-center w-full">
													{collection.user_id}
												</span>
											</CardHeader>
											<CardBody className="overflow-y-hidden">
												<CollectionContext.Provider
													value={{
														albums: collection.albums,
														setAlbums: () => {},
														isCollectionOpen: isCollectionOpen,
														setIsCollectionOpen,
														username: collection.user_id,
													}}
												>
													<CollectionPreviewVertical />
												</CollectionContext.Provider>
											</CardBody>
										</Card>
									);
								})
							}
						</div>
						<div className="w-full h-[7%] text-center content-center">
							<Button
								className="max-w-[25%]"
								onPress={fetchSharedCollections}
								isLoading={isSharedLoading}
								isDisabled={isSharedEnd}
							>
								{!isSharedEnd ? "Load More" : "No more collections"}
							</Button>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default SocialPage;
