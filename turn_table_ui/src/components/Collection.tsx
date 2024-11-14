import { useCollection } from "@/contexts/CollectionContext.tsx";
import type Album from "@/interfaces/Album.tsx";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { Modal, ModalBody, ModalContent } from "@nextui-org/modal";
import { useEffect, useRef, useState } from "react";

const Collection = () => {
	const { albums, isCollectionOpen, setIsCollectionOpen } = useCollection();
	const modalRef = useRef<HTMLDivElement | null>(null);
	const [currentSelectedIndex, setCurrentSelectedIndex] = useState(0);

	return (
		<>
			<Modal
				ref={modalRef}
				isOpen={isCollectionOpen}
				onClose={() => setIsCollectionOpen(false)}
				className="dark"
			>
				<ModalContent>
					{/* Display the albums like a box where you flick through them */}
					<ModalBody className="text-white min-h-screen">
						<Button
							onClick={() => setCurrentSelectedIndex(currentSelectedIndex + 1)}
						>
							Up
						</Button>
						<Button
							onClick={() => setCurrentSelectedIndex(currentSelectedIndex - 1)}
						>
							Down
						</Button>
						{albums.length === 0 ? (
							<div className="flex flex-col items-center justify-center h-full">
								You have no albums in your collection.
							</div>
						) : (
							<div className="min-h-96 flex flex-col overflow-y-scroll snap-y snap-mandatory perspective-1000">
								{/*albums.map((album: Album, index: number) => {
									let translateY = index * 10;
									if (index > currentSelectedIndex) {
										translateY += 200;
									}
									if (index === currentSelectedIndex) {
										translateY += 100;
									}
									return (
										<div
											key={index}
											className="absolute"
											style={{
												transform: `translateY(${translateY}%)`,
											}}
										>
											<Image src={album.image_url} alt={album.title} />
										</div>
									);
								})*/}
							</div>
						)}
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default Collection;
