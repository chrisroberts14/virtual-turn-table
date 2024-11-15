import Collection from "@/components/Collection.tsx";
import {
	CollectionContext,
	useCollection,
} from "@/contexts/CollectionContext.tsx";
import { useMusic } from "@/contexts/MusicContext.tsx";
import type Album from "@/interfaces/Album.tsx";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { Tooltip } from "@nextui-org/tooltip";
import { useEffect, useRef, useState } from "react";

export const CollectionPreviewHorizontal = () => {
	// Albums are sliding along the x-axis in a horizontal row
	const { albums } = useCollection();
	const sliderTrackRef = useRef<HTMLDivElement | null>(null);
	const [scrollAmount, setScrollAmount] = useState(0);
	const [isHovering, setIsHovering] = useState(false);
	const { setCurrentAlbum } = useMusic();

	useEffect(() => {
		let animationFrame: number;
		const sliderTrack = sliderTrackRef.current;
		// @ts-ignore
		const itemWidth = sliderTrack?.offsetWidth / albums.length;

		const animate = () => {
			if (isHovering) {
				return;
			}
			setScrollAmount((prev) => {
				const nextScroll = prev + 2;
				if (Math.abs(nextScroll) > (sliderTrack?.offsetWidth || 0)) {
					return -(itemWidth * albums.length);
				}
				return nextScroll;
			});
			animationFrame = requestAnimationFrame(animate);
		};
		animate();
		return () => cancelAnimationFrame(animationFrame);
	}, [isHovering, albums]);

	const handleMouseEnter = () => setIsHovering(true);
	const handleMouseLeave = () => setIsHovering(false);

	const handleClick = (album: Album) => {
		setCurrentAlbum(album);
	};

	const [isCollectionOpen, setIsCollectionOpen] = useState(false);

	return (
		<>
			<div className="text-center content-center px-3 pb-14 space-y-2">
				<header className="text-center text-white font-bold">
					{" "}
					Your Collection{" "}
				</header>
				<CollectionContext.Provider
					value={{
						albums,
						setAlbums: () => {},
						isCollectionOpen,
						setIsCollectionOpen,
					}}
				>
					<Button onClick={() => setIsCollectionOpen(true)}>More Detail</Button>
					<Collection />
				</CollectionContext.Provider>
			</div>
			<div className="overflow-x-hidden w-full">
				<div
					className="flex pt-2 whitespace-nowrap w-fit min-w-full space-x-10"
					ref={sliderTrackRef}
					style={{ transform: `translateX(${scrollAmount}px` }}
				>
					{albums.map((album: Album) => (
						<div
							key={album.title}
							className="aspect-square max-w-[150px]"
							onMouseOver={handleMouseEnter}
							onMouseLeave={handleMouseLeave}
							onFocus={handleMouseEnter}
						>
							<Tooltip
								className="dark text-white"
								content={
									<div>
										{album.title}
										<br />
										By {album.artists}
									</div>
								}
								closeDelay={0}
							>
								<Image
									src={album.image_url}
									alt={album.title}
									width={150}
									height={150}
									className="hover:scale-110"
									onClick={() => handleClick(album)}
								/>
							</Tooltip>
						</div>
					))}
				</div>
			</div>
		</>
	);
};

interface CollectionPreviewVerticalProps {
	albums: Album[];
}

export const CollectionPreviewVertical = ({
	albums,
}: CollectionPreviewVerticalProps) => {
	// Albums are appearing from the bottom of the div then going back down and the next one comes up
	// Then a button which opens a modal for actual album selection
	const [isCollectionOpen, setIsCollectionOpen] = useState(false);
	const [currentAlbumIndex, setCurrentAlbumIndex] = useState(0);
	const intervalLength = Math.random() * 7000 + 3000;

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentAlbumIndex((prev) => (prev + 1) % albums.length);
		}, intervalLength);
		return () => clearInterval(interval);
	}, [albums, intervalLength]);

	return (
		<CollectionContext.Provider
			value={{
				albums,
				setAlbums: () => {},
				isCollectionOpen,
				setIsCollectionOpen,
			}}
		>
			<div className="w-full h-full text-center overflow-hidden">
				{/* Create images that sit on top of each other and move up the one that is the current index */}
				{albums.map((album: Album, index: number) => {
					return (
						<div
							key={album.title}
							className="absolute max-w-full aspect-square left-0 right-0 px-3"
							style={{
								transform: `translateY(${index === currentAlbumIndex ? 0 : 500}%)`,
								transition: "transform 0.5s ease-in-out",
							}}
						>
							<Image src={album.image_url} alt={album.title} />
						</div>
					);
				})}
			</div>
			<Button onClick={() => setIsCollectionOpen(true)}>Open</Button>
			<Collection />
		</CollectionContext.Provider>
	);
};
