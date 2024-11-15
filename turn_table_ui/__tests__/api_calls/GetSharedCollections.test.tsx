import axios from "axios";
import { vi } from "vitest";
import GetSharedCollections from "../../src/api_calls/GetSharedCollections";

vi.mock("axios");

describe("GetSharedCollections", () => {
	const accessToken = "accessToken";
	const testUser = "testUser";

	it("should return public collections", async () => {
		// @ts-ignore
		(axios.get as vi.Mock).mockImplementation(() =>
			Promise.resolve({ data: [] }),
		);
		await expect(GetSharedCollections(testUser, accessToken)).resolves.toEqual(
			[],
		);
	});

	it("should throw an axios error when it fails", async () => {
		// @ts-ignore
		(axios.get as vi.Mock).mockImplementation(() =>
			Promise.reject({ response: { data: { message: "test" } } }),
		);
		// @ts-ignore
		(axios.isAxiosError as vi.Mock).mockImplementation(() => true);
		await expect(GetSharedCollections(testUser, accessToken)).rejects.toThrow(
			Error,
		);
	});

	it("should throw an non axios error when it fails", async () => {
		// @ts-ignore
		(axios.get as vi.Mock).mockImplementation(() =>
			Promise.reject({ response: { data: { message: "test" } } }),
		);
		// @ts-ignore
		(axios.isAxiosError as vi.Mock).mockImplementation(() => false);
		await expect(GetSharedCollections(testUser, accessToken)).rejects.toThrow(
			Error,
		);
	});
});
