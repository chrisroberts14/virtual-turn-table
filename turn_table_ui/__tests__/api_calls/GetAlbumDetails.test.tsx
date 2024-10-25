import axios from "axios";
import { vi } from "vitest";
import GetAlbumDetails from "../../src/api_calls/GetAlbumDetails";

vi.mock("axios");

describe("GetAlbumDetails", () => {
	it("should return album details", async () => {
		const albumURI = "albumURI";
		const accessToken = "accessToken";
		// @ts-ignore
		(axios.get as vi.Mock).mockImplementation(() =>
			Promise.resolve({ data: "albumDetails" }),
		);
		await expect(GetAlbumDetails(albumURI, accessToken)).resolves.toEqual(
			"albumDetails",
		);
	});

	it("should throw an axios error when it fails", async () => {
		const albumURI = "albumURI";
		const accessToken = "accessToken";
		// @ts-ignore
		(axios.get as vi.Mock).mockImplementation(() =>
			Promise.reject({ response: { data: { message: "test" } } }),
		);
		// @ts-ignore
		(axios.isAxiosError as vi.Mock).mockImplementation(() => true);
		await expect(GetAlbumDetails(albumURI, accessToken)).rejects.toThrow(Error);
	});

	it("should throw an non axios error when it fails", async () => {
		const albumURI = "albumURI";
		const accessToken = "accessToken";
		// @ts-ignore
		(axios.get as vi.Mock).mockImplementation(() =>
			Promise.reject({ response: { data: { message: "test" } } }),
		);
		// @ts-ignore
		(axios.isAxiosError as vi.Mock).mockImplementation(() => false);
		await expect(GetAlbumDetails(albumURI, accessToken)).rejects.toThrow(Error);
	});
});
