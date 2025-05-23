import AlbumCollectionDisplay from "@/components/AlbumCollectionDisplay.tsx";
import { AlbumSelectionContext } from "@/contexts/AlbumSelectionContext.tsx";
import type Album from "@/interfaces/Album.tsx";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import { useState } from "react";

const AlbumHistorySelector = () => {
	const [hoveredAlbum, setHoveredAlbum] = useState<Album | null>(null);
	const [albums, setAlbums] = useState<Album[]>([]);

	return (
		<AlbumSelectionContext.Provider
			value={{ hoveredAlbum, setHoveredAlbum, albums, setAlbums }}
		>
			<div className="min-w-[25%] max-h-full pt-2 bg-gray-900">
				<Card className="max-h-fit">
					<CardBody>
						<div className="flex flex-col items-center">
							<div className="text-center text-sm sm:text-medium">
								Album History
							</div>
						</div>
					</CardBody>
				</Card>
				<div className="px-2 py-1 max-h-full">
					<Card className="max-h-full">
						<CardHeader className="justify-center">
							<div className="flex flex-col items-center w-full">
								<div className="text-center w-full overflow-x-auto">
									{!hoveredAlbum ? (
										<Skeleton className="rounded-lg">
											<div className="h-6 rounded-lg bg-default-300 w-full" />
										</Skeleton>
									) : (
										<span className="text-nowrap">{hoveredAlbum.title}</span>
									)}
								</div>
							</div>
						</CardHeader>
						<CardFooter className="justify-center w-full">
							<div className="flex flex-col items-center w-full">
								<div className="text-center w-full">
									{!hoveredAlbum ? (
										<Skeleton className="rounded-lg">
											<div className="h-6 rounded-lg bg-default-300 w-full" />
										</Skeleton>
									) : (
										<span className="text-nowrap">{`By ${hoveredAlbum.artists}`}</span>
									)}
								</div>
							</div>
						</CardFooter>
					</Card>
				</div>
			</div>
			<div className="flex-grow flex justify-center w-screen overflow-x-auto">
				<AlbumCollectionDisplay />
			</div>
		</AlbumSelectionContext.Provider>
	);
};

export default AlbumHistorySelector;
