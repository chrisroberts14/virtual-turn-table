import AlbumConfirm from "@/components/AlbumConfirm.tsx";
import Upload from "@/components/Upload.tsx";
import type Album from "@/interfaces/Album.tsx";
import { Button } from "@nextui-org/button";
import axios from "axios";
import { Resizable } from "re-resizable";
import type React from "react";
import {
	type SetStateAction,
	forwardRef,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import Webcam from "react-webcam";

type MediaDeviceInfo = {
	kind: string;
	label: string;
	deviceId: string;
	groupId: string;
};

interface ScanPageProps {
	currentAlbum: Album | null;
	setCurrentAlbum: React.Dispatch<SetStateAction<Album | null>>;
}

const ScanPage = forwardRef<HTMLDivElement, ScanPageProps>((props, ref) => {
	const [contentHeight, setContentHeight] = useState(window.innerHeight - 240);
	const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
	const webcamRef = useRef<Webcam | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [scannedAlbum, setScannedAlbum] = useState<Album | null>(null);

	const onResize = () => {
		setContentHeight(window.innerHeight - 240);
	};

	window.addEventListener("resize", onResize);

	// Use callback to cache the function between refreshes
	const getCameras = useCallback((mediaDevices: MediaDeviceInfo[]) => {
		setCameras(mediaDevices.filter(({ kind }) => kind === "videoinput"));
	}, []);

	useEffect(() => {
		navigator.mediaDevices.enumerateDevices().then((devices) => {
			getCameras(devices as MediaDeviceInfo[]);
		});
	}, [getCameras]);

	const getAlbum = async () => {
		setIsUploading(true);
		if (webcamRef.current) {
			if (!(webcamRef.current instanceof Webcam)) {
				return;
			}
			const imageSrc = webcamRef.current.getScreenshot();
			if (!imageSrc) {
				console.error("Failed to capture image");
				setIsUploading(false);
				return;
			}

			await axios
				.post(
					`${import.meta.env.VITE_BFF_ADDRESS}image_to_album/`,
					{ image: imageSrc },
					{
						headers: {
							"Content-Type": "application/json",
						},
					},
				)
				.then((response) => {
					const newAlbum: Album = response.data;
					setScannedAlbum(newAlbum);
				})
				.catch((error) => {
					console.log(error);
				});
		}
		setIsUploading(false);
	};

	return (
		<div className="flex flex-col h-full" ref={ref}>
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
					{scannedAlbum || isUploading ? (
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
							minWidth={"20%"}
							maxWidth={"25%"}
							maxHeight={"100%"}
						>
							<div className="overflow-y-auto h-full max-h-full">
								<AlbumConfirm
									scannedAlbum={scannedAlbum}
									setCurrentAlbum={props.setCurrentAlbum}
									setScannedAlbum={setScannedAlbum}
								/>
							</div>
						</Resizable>
					) : null}

					<div className="flex flex-grow p-3 justify-center relative max-w-full">
						{cameras.length === 0 ? (
							<div className="flex flex-col items-center">
								No cameras found
								<Upload
									setScannedAlbum={setScannedAlbum}
									setIsUploading={setIsUploading}
								/>
							</div>
						) : (
							<div>
								<Webcam
									audio={false}
									screenshotFormat="image/jpeg"
									className="rounded-lg object-cover w-full h-full p-8 pb-16"
									ref={webcamRef}
								/>
								<div className="p-4 text-center absolute bottom-0 w-full left-0">
									<Button onClick={getAlbum} isDisabled={isUploading}>
										Capture
									</Button>
								</div>
							</div>
						)}
					</div>
				</div>
			</Resizable>
			<div className="flex-grow bg-primary-100 flex justify-center pt-2 w-screen">
				<div className="flex flex-col min-w-[30%]">
					<div>Previously scanned albums:</div>
					<div>Selected album</div>
				</div>
				<div className="flex-grow">Album selection</div>
			</div>
		</div>
	);
});

export default ScanPage;
