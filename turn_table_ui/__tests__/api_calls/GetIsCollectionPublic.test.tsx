import axios from "axios";
import { vi } from "vitest";
import GetIsCollectionPublic from "../../src/api_calls/GetIsCollectionPublic";

vi.mock("axios");

describe("GetIsCollectionPublic", () => {
	const username = "test_user";

	it("should return isCollectionPublic", async () => {
		// @ts-ignore
		(axios.get as vi.Mock).mockImplementation(() =>
			Promise.resolve({ data: true }),
		);
		await expect(GetIsCollectionPublic(username)).resolves.toEqual(true);
	});

	it("should throw an axios error when it fails", async () => {
		// @ts-ignore
		(axios.get as vi.Mock).mockImplementation(() =>
			Promise.reject({ response: { data: { message: "test" } } }),
		);
		// @ts-ignore
		(axios.isAxiosError as vi.Mock).mockImplementation(() => true);
		await expect(GetIsCollectionPublic(username)).rejects.toThrow(Error);
	});

	it("should throw an non axios error when it fails", async () => {
		// @ts-ignore
		(axios.get as vi.Mock).mockImplementation(() =>
			Promise.reject({ response: { data: { message: "test" } } }),
		);
		// @ts-ignore
		(axios.isAxiosError as vi.Mock).mockImplementation(() => false);
		await expect(GetIsCollectionPublic(username)).rejects.toThrow(Error);
	});
});
