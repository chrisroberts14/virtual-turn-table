import AlbumConfirm from "@/components/AlbumConfirm.tsx";
import type Album from "@/interfaces/Album.tsx";
import { Button } from "@nextui-org/button";
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
	const webcamRef = useRef<Webcam>(null);

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

	const getAlbum = useCallback(() => {
		if (webcamRef.current) {
			const imageSrc = webcamRef.current.getScreenshot();
			if (imageSrc) {
				console.log(imageSrc);
			} else {
				console.error("Failed to capture image");
			}
		}
	}, []);

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
						minWidth={"20%"}
						maxWidth={"45%"}
					>
						<div className="overflow-y-auto h-full">
							<AlbumConfirm scannedAlbum={props.currentAlbum} />
						</div>
					</Resizable>
					<div className="flex-grow p-3 max-w-[65%] relative">
						{cameras.length === 0 ? (
							<div>No cameras found</div>
						) : (
							<div>
								<div className="flex justify-center max-h-full p-32 flex-col">
									<Webcam
										audio={false}
										screenshotFormat="image/jpeg"
										className="rounded-lg object-cover absolute top-0 left-0 w-full h-full p-8 pb-16"
										ref={webcamRef}
									/>
									<div className="p-4 text-center absolute bottom-0 w-full left-0">
										<Button onClick={getAlbum}>Capture</Button>
									</div>
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
};

export default ScanPage;
