// Test getScreenShot function

import getScreenShot from "../../src/utils/GetScreenShot";

describe("getScreenShot", () => {
	it("should return the screenshot", () => {
		const webcam = {
			current: {
				getScreenshot: () => "screenshot",
			},
		};

		expect(getScreenShot(webcam as any)).toBe("screenshot");
	});

	it("should return undefined if webcam.current is undefined", () => {
		const webcam = {
			current: undefined,
		};

		expect(getScreenShot(webcam as any)).toBe(undefined);
	});
});
