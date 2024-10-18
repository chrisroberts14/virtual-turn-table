import { Button } from "@nextui-org/button";
import { Resizable } from "re-resizable";
import { useState } from "react";
import Webcam from "react-webcam";

const ScanPage = () => {
	const [contentHeight, setContentHeight] = useState(window.innerHeight - 240);

	const onResize = () => {
		setContentHeight(window.innerHeight - 240);
	};

	window.addEventListener("resize", onResize);

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
					>
						<div className="overflow-y-auto h-full">Song Confirm</div>
					</Resizable>
					<div className="flex-grow p-3 max-w-[65%]">
						<Webcam
							audio={false}
							height={720}
							screenshotFormat="image/jpeg"
							width={1920}
						/>
					</div>
					<div className="p-4">
						<Button>Upload picture</Button>
					</div>
				</div>
			</Resizable>
			<div className="flex-grow bg-primary-100 flex justify-center pt-2 w-screen">
				Footer
			</div>
		</div>
	);
};

export default ScanPage;
