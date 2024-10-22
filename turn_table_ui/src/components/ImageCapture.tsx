import ImageToAlbum from "@/api_calls/ImageToAlbum.tsx";
import Upload from "@/components/Upload.tsx";
import { useUpload } from "@/contexts/CaptureContext.tsx";
import { useError } from "@/contexts/ErrorContext.tsx";
import { Button } from "@nextui-org/button";
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

			await ImageToAlbum(imageSrc, setScannedAlbum).catch((error) => {
				showError(error.message);
			});
		}
		setIsUploading(false);
	};

	return (
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
					<Button onClick={() => setUsingCamera(!usingCamera)} className="mt-4">
						Use camera
					</Button>
				</div>
			)}
		</div>
	);
};

export default ImageCapture;
