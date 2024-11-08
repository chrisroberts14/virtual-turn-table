import ImageToAlbum from "@/api_calls/ImageToAlbum.tsx";
import Upload from "@/components/Upload.tsx";
import { useError } from "@/contexts/ErrorContext.tsx";
import { useNavigation } from "@/contexts/NavigationContext.tsx";
import { useUpload } from "@/contexts/UploadContext.tsx";
import type Album from "@/interfaces/Album.tsx";
import getScreenShot from "@/utils/GetScreenShot.tsx";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { Spinner } from "@nextui-org/spinner";
import { Tab, Tabs } from "@nextui-org/tabs";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaCamera, FaUpload } from "react-icons/fa";
import Webcam from "react-webcam";

const ImageCapture = () => {
	const {
		setScannedAlbum,
		isUploading,
		setIsUploading,
		fadeConfirm,
		setFadeConfirm,
		currentImage,
		setCurrentImage,
	} = useUpload();
	const webcamRef = useRef<Webcam | null>(null);
	const { showError } = useError();
	const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
	const [currentCameraId, setCurrentCameraId] = useState<string | null>(null);
	const { currentPage } = useNavigation();

	// Use callback to cache the function between refreshes
	const getCameras = useCallback((mediaDevices: MediaDeviceInfo[]) => {
		setCameras(mediaDevices.filter(({ kind }) => kind === "videoinput"));
	}, []);

	useEffect(() => {
		navigator.mediaDevices.enumerateDevices().then((devices) => {
			getCameras(devices as MediaDeviceInfo[]);
		});
		setCurrentCameraId(cameras[0]?.deviceId || null);
	}, [getCameras, cameras[0]?.deviceId]);

	const triggerConfirmSlide = () => {
		setFadeConfirm(!fadeConfirm);
	};

	const getAlbumFromCamera = () => {
		setIsUploading(true);
		triggerConfirmSlide();
		if (webcamRef.current) {
			const imageSrc = getScreenShot(webcamRef);
			if (!imageSrc) {
				showError("Failed to capture image");
				setIsUploading(false);
				return;
			}
			setCurrentImage(imageSrc);
			ImageToAlbum(imageSrc)
				.then((album: Album) => {
					setScannedAlbum(album);
					setIsUploading(false);
				})
				.catch((error) => {
					setIsUploading(false);
					setScannedAlbum(null);
					showError(error.message);
				});
		}
	};

	const switchCamera = () => {
		if (cameras.length > 1) {
			const currentIndex = cameras.findIndex(
				(camera) => camera.deviceId === currentCameraId,
			);
			const nextCamera = cameras[(currentIndex + 1) % cameras.length];
			setCurrentCameraId(nextCamera.deviceId);
		}
	};

	// @ts-ignore
	return (
		<div
			className={`flex p-3 justify-center relative max-w-full bg-gray-700 transition-all duration-500 ease-in-out ${
				fadeConfirm ? "flex-grow-0 w-3/4" : "flex-grow w-full"
			}`}
		>
			{cameras.length === 0 ? (
				<div className="flex flex-col items-center text-center">
					No cameras found only upload available
					<br />
					Detecting cameras...
					<br />
					<Spinner className="pt-2 pb-4" title="Detecting cameras..." />
					<Upload triggerConfirmSlide={triggerConfirmSlide} />
				</div>
			) : (
				<div className="flex flex-col">
					<div className="justify-center text-center content-center">
						<Tabs>
							<Tab
								key="camera"
								title={
									<div
										className="flex items-center space-x-2"
										title="Swap to camera"
									>
										<FaCamera />
										<span> Camera </span>
									</div>
								}
							>
								<div className="flex justify-center pt-8" title="Webcam">
									{
										// @ts-ignore
										// Strange error appears here if you set it as a number rather than string
										currentPage === "1" &&
											(!currentImage ? (
												<Webcam
													audio={false}
													screenshotFormat="image/png"
													className="rounded-lg object-cover w-[65%] pb-4"
													ref={webcamRef}
													width={1920}
													height={1080}
													videoConstraints={{
														deviceId: currentCameraId || undefined,
													}}
												/>
											) : (
												<Image src={currentImage} alt="Captured Image" />
											))
									}
								</div>
								<div className="space-x-2">
									<Button
										className="bg-blue-600"
										onClick={getAlbumFromCamera}
										disabled={isUploading}
									>
										Capture
									</Button>
									{cameras.length > 1 && (
										<Button
											className="bg-blue-600"
											onClick={switchCamera}
											disabled={cameras.length <= 1}
										>
											Switch Camera
										</Button>
									)}
								</div>
							</Tab>
							<Tab
								key="upload"
								title={
									<div
										className="flex items-center space-x-2"
										title="Swap to upload"
									>
										<FaUpload />
										<span> Upload </span>
									</div>
								}
							>
								<Upload triggerConfirmSlide={triggerConfirmSlide} />
							</Tab>
						</Tabs>
					</div>
				</div>
			)}
		</div>
	);
};

export default ImageCapture;
