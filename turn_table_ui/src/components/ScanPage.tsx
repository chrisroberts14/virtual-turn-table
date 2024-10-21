import AlbumConfirm from "@/components/AlbumConfirm.tsx";
import Upload from "@/components/Upload.tsx";
import { useError } from "@/contexts/ErrorContext.tsx";
import type Album from "@/interfaces/Album.tsx";
import { Button } from "@nextui-org/button";
import axios from "axios";
import { Resizable } from "re-resizable";
import type React from "react";
import {
	type SetStateAction,
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

const ScanPage = (props: {
	currentAlbum: Album | null;
	setCurrentAlbum: React.Dispatch<SetStateAction<Album | null>>;
}) => {
	const [contentHeight, setContentHeight] = useState(window.innerHeight - 240);
	const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
	const webcamRef = useRef<Webcam | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [scannedAlbum, setScannedAlbum] = useState<Album | null>(null);
	const [fadeConfirm, setFadeConfirm] = useState(false);
	const [usingCamera, setUsingCamera] = useState(false);
	const { showError } = useError();

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
		triggerConfirmSlide();
		if (webcamRef.current) {
			const imageSrc = webcamRef.current.getScreenshot();
			if (!imageSrc) {
				showError("Failed to capture image");
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
					showError(error.response.data.message);
				});
		}
		setIsUploading(false);
	};

	const triggerConfirmSlide = () => {
		setFadeConfirm(!fadeConfirm);
	};

	return (
		<div className="flex flex-col h-full">
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
						maxWidth={"25%"}
						maxHeight={"100%"}
						style={{
							transition: "width 0.5s ease-in-out",
							overflow: "hidden", // Hide content when collapsed
						}}
						size={{
							width: fadeConfirm ? "25%" : "0%", // Resizes based on the state
						}}
						className="bg-gray-700"
					>
						<div className="overflow-y-auto h-full max-h-full">
							<AlbumConfirm
								scannedAlbum={scannedAlbum}
								setCurrentAlbum={props.setCurrentAlbum}
								setScannedAlbum={setScannedAlbum}
								triggerConfirmSlide={triggerConfirmSlide}
							/>
						</div>
					</Resizable>
					<div
						className={`flex p-3 justify-center relative max-w-full bg-gray-700 transition-all duration-500 ease-in-out ${
							fadeConfirm ? "flex-grow-0 w-3/4" : "flex-grow w-full"
						}`}
					>
						{cameras.length === 0 ? (
							<div className="flex flex-col items-center">
								No cameras found
								<Upload
									setScannedAlbum={setScannedAlbum}
									setIsUploading={setIsUploading}
									triggerConfirmSlide={triggerConfirmSlide}
								/>
							</div>
						) : usingCamera ? (
							<div>
								<Webcam
									audio={false}
									screenshotFormat="image/jpeg"
									className="rounded-lg object-cover w-full h-full p-8 pb-16"
									ref={webcamRef}
								/>
								<div className="p-4 text-center absolute bottom-0 w-full left-0 space-x-2">
									<Button
										onClick={getAlbum}
										isDisabled={scannedAlbum !== null || isUploading}
									>
										Capture
									</Button>
									<Button
										onClick={() => setUsingCamera(!usingCamera)}
										className="mt-4"
									>
										Use file upload
									</Button>
								</div>
							</div>
						) : (
							<div className="text-center">
								<Upload
									setScannedAlbum={setScannedAlbum}
									setIsUploading={setIsUploading}
									triggerConfirmSlide={triggerConfirmSlide}
								/>
								<Button
									onClick={() => setUsingCamera(!usingCamera)}
									className="mt-4"
								>
									Use camera
								</Button>
							</div>
						)}
					</div>
				</div>
			</Resizable>
			<div className="flex-grow bg-gray-900 flex justify-center pt-2 w-screen">
				<div className="flex flex-col min-w-[30%]">
					<div>Previously scanned albums:</div>
					<div>Selected album</div>
				</div>
				<div className="flex-grow">Album selection</div>
			</div>
		</div>
	);
};

export default ScanPage;
