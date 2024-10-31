import AlbumConfirm from "@/components/AlbumConfirm.tsx";
import AlbumHistorySelector from "@/components/AlbumHistorySelector.tsx";
import ImageCapture from "@/components/ImageCapture.tsx";
import { UploadContext } from "@/contexts/UploadContext.tsx";
import useResizeHandler from "@/hooks/UseResizeHandler.tsx";
import type Album from "@/interfaces/Album.tsx";
import { Resizable } from "re-resizable";
import { useState } from "react";

const ScanPage = () => {
	const [isUploading, setIsUploading] = useState(false);
	const [scannedAlbum, setScannedAlbum] = useState<Album | null>(null);
	const [fadeConfirm, setFadeConfirm] = useState(false);
	const [currentImage, setCurrentImage] = useState<string | null>(null);
	const contentHeight = useResizeHandler(240);

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
				<div className="flex h-full bg-gray-900 w-screen p-1">
					<AlbumHistorySelector />
				</div>
			</div>
		</UploadContext.Provider>
	);
};

export default ScanPage;
