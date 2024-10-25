import axios from "axios";
import { vi } from "vitest";
import GetUserAlbums from "../../src/api_calls/GetUserAlbums";

vi.mock("axios");

describe("GetUserAlbums", () => {
	it("should return data", () => {
		const username = "test_user";
		// @ts-ignore
		(axios.get as vi.Mock).mockImplementation(() =>
			Promise.resolve({ data: "test" }),
		);
		expect(GetUserAlbums(username)).resolves.toEqual("test");
		expect(axios.get).toHaveBeenCalled();
	});

	it("should throw an axios error when it fails", async () => {
		const username = "test_user";
		// @ts-ignore
		(axios.get as vi.Mock).mockImplementation(() =>
			Promise.reject({ response: { data: { message: "test" } } }),
		);
		// @ts-ignore
		(axios.isAxiosError as vi.Mock).mockImplementation(() => true);
		await expect(GetUserAlbums(username)).rejects.toThrow(Error);
		expect(axios.get).toHaveBeenCalled();
	});

	it("should throw a non axios error when it fails", async () => {
		const username = "test_user";
		// @ts-ignore
		(axios.get as vi.Mock).mockImplementation(() =>
			Promise.reject({ response: { data: { message: "test" } } }),
		);
		// @ts-ignore
		(axios.isAxiosError as vi.Mock).mockImplementation(() => false);
		await expect(GetUserAlbums(username)).rejects.toThrow(Error);
		expect(axios.get).toHaveBeenCalled();
	});
});
