import { useCollection } from "@/contexts/CollectionContext.tsx";
import { useMusic } from "@/contexts/MusicContext.tsx";
import type Album from "@/interfaces/Album.tsx";
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
		if (albums.length === 0 || !sliderTrack) {
			return;
		}
		const itemWidth = sliderTrack?.offsetWidth / albums.length;

		const animate = () => {
			if (isHovering) {
				return;
			}
			setScrollAmount((prev) => {
				const nextScroll = prev + 1;
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

	return (
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
	);
};

export const CollectionPreviewVertical = () => {
	// Albums are appearing from the bottom of the div then going back down and the next one comes up
};
