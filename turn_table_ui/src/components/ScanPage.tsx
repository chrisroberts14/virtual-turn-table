import { Button } from "@nextui-org/button";
import { Resizable } from "re-resizable";
import { useCallback, useEffect, useState } from "react";
import Webcam from "react-webcam";

type MediaDeviceInfo = {
	kind: string;
	label: string;
	deviceId: string;
	groupId: string;
};

const ScanPage = () => {
	const [contentHeight, setContentHeight] = useState(window.innerHeight - 240);
	const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);

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
						<div className="overflow-y-auto h-full">Song Confirm</div>
					</Resizable>
					<div className="flex-grow p-3 max-w-[65%]">
						{cameras.length === 0 ? (
							<div>No cameras found</div>
						) : (
							<div className="flex justify-center max-h-full p-32 flex-col">
								<Webcam
									audio={false}
									height={1080}
									screenshotFormat="image/jpeg"
									width={1920}
									className="rounded-lg"
								/>
								<div className="p-4 text-center min-w-[20%] justify-center">
									<Button>Upload picture</Button>
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
