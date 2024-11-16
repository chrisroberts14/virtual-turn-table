import { useCollection } from "@/contexts/CollectionContext.tsx";
import { useMusic } from "@/contexts/MusicContext.tsx";
import type Album from "@/interfaces/Album.tsx";
import { Button } from "@nextui-org/button";
import { Card, CardFooter, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Modal, ModalBody, ModalContent } from "@nextui-org/modal";
import { useState } from "react";
import { FaArrowDown, FaArrowUp, FaPlay } from "react-icons/fa";

const Collection = () => {
	const { albums, isCollectionOpen, setIsCollectionOpen, username } =
		useCollection();
	const [currentSelectedIndex, setCurrentSelectedIndex] = useState(0);
	const { setCurrentAlbum } = useMusic();

	const goUp = () => {
		if (currentSelectedIndex === 0) {
			setCurrentSelectedIndex(albums.length - 1);
		} else {
			setCurrentSelectedIndex(currentSelectedIndex - 1);
		}
	};

	const goDown = () => {
		if (currentSelectedIndex === albums.length - 1) {
			setCurrentSelectedIndex(0);
		} else {
			setCurrentSelectedIndex(currentSelectedIndex + 1);
		}
	};

	const handlePlay = (album: Album) => {
		setCurrentAlbum(album);
		setIsCollectionOpen(false);
	};

	return (
		<>
			<Modal
				isOpen={isCollectionOpen}
				onClose={() => setIsCollectionOpen(false)}
				className="dark align-center justify-center pb-10"
			>
				<ModalContent className="text-white">
					{/* Display the albums like a box where you flick through them */}
					<header className="text-center font-bold text-lg">
						The collection of {username}
					</header>
					<ModalBody className="text-white h-[80%]">
						{albums.length === 0 ? (
							// Can get away with this because the user can't share
							// an empty collection so the only time you can open one
							// is if it is your own
							<div className="flex flex-col items-center justify-center h-full w-full">
								You have no albums in your collection.
							</div>
						) : (
							<>
								<Card>
									<Card className="max-h-full">
										<CardHeader className="justify-center flex flex-col space-y-2">
											<div className="flex flex-col items-center w-full">
												<div className="text-center w-full overflow-x-auto">
													<span className="text-nowrap">
														{albums[currentSelectedIndex]?.title}
													</span>
												</div>
											</div>
											<div className="flex flex-col items-center w-full">
												<div className="text-center w-full">
													<span className="text-nowrap">{`By ${albums[currentSelectedIndex]?.artists}`}</span>
												</div>
											</div>
										</CardHeader>
										<CardFooter className="justify-center w-full">
											<Button
												color="success"
												endContent={<FaPlay />}
												onClick={() => handlePlay(albums[currentSelectedIndex])}
											>
												Play
											</Button>
										</CardFooter>
									</Card>
								</Card>
								<div className="flex flex-row space-x-5">
									<div className="min-h-[600px] flex flex-col overflow-y-hiden min-w-[85%] perspective-1000 p-2">
										{albums.map((album: Album, index: number) => {
											let translateY = 0;
											let translateZ = 0;
											if (index > currentSelectedIndex) {
												// Ones in front of the current selected index
												const indexDiff = index - currentSelectedIndex;
												translateY = 110 + indexDiff * 10;
												translateZ = indexDiff * 10;
											}
											if (index < currentSelectedIndex) {
												// Ones behind the current selected index
												const indexDiff = index - currentSelectedIndex;
												translateY = 110 + indexDiff * 10;
												translateZ = -200 + indexDiff * 10;
											}
											if (index === currentSelectedIndex) {
												// The current selected index
												translateY = 0;
												translateZ = 0;
											}
											return (
												<div
													key={album.title}
													className="absolute duration-300"
													style={{
														transform: `translate3d(0, ${translateY}%, ${translateZ}px)`, //`translateY(${translateY}%)`,
													}}
												>
													<Image src={album.image_url} alt={album.title} />
												</div>
											);
										})}
									</div>
									<div className="flex flex-col space-y-2 justify-center align-center text-center">
										<Button onClick={goUp} isIconOnly>
											<FaArrowUp />
										</Button>
										{currentSelectedIndex + 1} / {albums.length}
										<Button onClick={goDown} isIconOnly>
											<FaArrowDown />
										</Button>
									</div>
								</div>
							</>
						)}
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default Collection;
