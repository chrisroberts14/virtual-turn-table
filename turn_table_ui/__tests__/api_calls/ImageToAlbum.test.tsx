import axios from "axios";
import { vi } from "vitest";
import ImageToAlbum from "../../src/api_calls/ImageToAlbum";

vi.mock("axios");

describe("ImageToAlbum", () => {
	it("should return data", () => {
		const image = "test_image";
		// @ts-ignore
		(axios.post as vi.Mock).mockImplementation(() =>
			Promise.resolve({ data: "test" }),
		);
		expect(ImageToAlbum(image)).resolves.toEqual("test");
		expect(axios.post).toHaveBeenCalled();
	});

	it("should throw an axios error when it fails", async () => {
		const image = "test_image";
		// @ts-ignore
		(axios.post as vi.Mock).mockImplementation(() =>
			Promise.reject({ response: { data: { message: "test" } } }),
		);
		// @ts-ignore
		(axios.isAxiosError as vi.Mock).mockImplementation(() => true);
		await expect(ImageToAlbum(image)).rejects.toThrow(Error);
		expect(axios.post).toHaveBeenCalled();
	});

	it("should throw a non axios error when it fails", async () => {
		const image = "test_image";
		// @ts-ignore
		(axios.post as vi.Mock).mockImplementation(() =>
			Promise.reject({ response: { data: { message: "test" } } }),
		);
		// @ts-ignore
		(axios.isAxiosError as vi.Mock).mockImplementation(() => false);
		await expect(ImageToAlbum(image)).rejects.toThrow(Error);
		expect(axios.post).toHaveBeenCalled();
	});
});
