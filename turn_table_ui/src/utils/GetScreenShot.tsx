import type { MutableRefObject } from "react";
import type Webcam from "react-webcam";

const getScreenShot = (webcam: MutableRefObject<Webcam | null>) => {
	if (webcam.current) {
		return webcam.current.getScreenshot();
	}
};

export default getScreenShot;
