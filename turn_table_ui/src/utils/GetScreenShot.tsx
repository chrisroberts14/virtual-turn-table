import type { MutableRefObject } from "react";
import type Webcam from "react-webcam";

// This function gets a screenshot from the webcam
// Is in its own function so we can mock the return value in tests
// Given this is a function from a library we don't need to test it

const getScreenShot = (webcam: MutableRefObject<Webcam | null>) => {
	if (webcam.current) {
		return webcam.current.getScreenshot();
	}
};

export default getScreenShot;
