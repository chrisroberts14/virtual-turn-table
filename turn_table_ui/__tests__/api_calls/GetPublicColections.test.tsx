import axios from "axios";
import { vi } from "vitest";
import GetPublicCollections from "../../src/api_calls/GetPublicCollections";

vi.mock("axios");

describe("GetPublicCollections", () => {
	const accessToken = "accessToken";
	it("should return public collections", async () => {
		// @ts-ignore
		(axios.get as vi.Mock).mockImplementation(() =>
			Promise.resolve({ data: [] }),
		);
		await expect(GetPublicCollections(accessToken)).resolves.toEqual([]);
	});

	it("should throw an axios error when it fails", async () => {
		// @ts-ignore
		(axios.get as vi.Mock).mockImplementation(() =>
			Promise.reject({ response: { data: { message: "test" } } }),
		);
		// @ts-ignore
		(axios.isAxiosError as vi.Mock).mockImplementation(() => true);
		await expect(GetPublicCollections(accessToken)).rejects.toThrow(Error);
	});

	it("should throw an non axios error when it fails", async () => {
		// @ts-ignore
		(axios.get as vi.Mock).mockImplementation(() =>
			Promise.reject({ response: { data: { message: "test" } } }),
		);
		// @ts-ignore
		(axios.isAxiosError as vi.Mock).mockImplementation(() => false);
		await expect(GetPublicCollections(accessToken)).rejects.toThrow(Error);
	});
});
