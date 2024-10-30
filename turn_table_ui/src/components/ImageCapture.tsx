import ImageToAlbum from "@/api_calls/ImageToAlbum.tsx";
import Upload from "@/components/Upload.tsx";
import { useError } from "@/contexts/ErrorContext.tsx";
import { useUpload } from "@/contexts/UploadContext.tsx";
import type Album from "@/interfaces/Album.tsx";
import getScreenShot from "@/utils/GetScreenShot.tsx";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { Spinner } from "@nextui-org/spinner";
import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

const ImageCapture = () => {
	const {
		scannedAlbum,
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
	const [usingCamera, setUsingCamera] = useState<boolean>(false);

	// Use callback to cache the function between refreshes
	const getCameras = useCallback((mediaDevices: MediaDeviceInfo[]) => {
		setCameras(mediaDevices.filter(({ kind }) => kind === "videoinput"));
	}, []);

	useEffect(() => {
		navigator.mediaDevices.enumerateDevices().then((devices) => {
			getCameras(devices as MediaDeviceInfo[]);
		});
	}, [getCameras]);

	const triggerConfirmSlide = () => {
		setFadeConfirm(!fadeConfirm);
	};

	const getAlbum = () => {
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
					<Spinner className="pt-2" title="Detecting cameras..." />
					<Upload triggerConfirmSlide={triggerConfirmSlide} />
				</div>
			) : usingCamera ? (
				<div>
					{!currentImage ? (
						<Webcam
							audio={false}
							screenshotFormat="image/png"
							className="rounded-lg object-cover w-full h-full p-8 pb-16"
							ref={webcamRef}
							width={1920}
							height={1080}
						/>
					) : (
						<Image src={currentImage} alt="Captured Image" />
					)}
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
					<Upload triggerConfirmSlide={triggerConfirmSlide} />
					<Button onClick={() => setUsingCamera(!usingCamera)} className="mt-4">
						Use camera
					</Button>
				</div>
			)}
		</div>
	);
};

export default ImageCapture;
