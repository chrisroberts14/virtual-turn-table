import axios from "axios";
import { vi } from "vitest";
import GetNotifications from "../../src/api_calls/GetNotifications";

vi.mock("axios");

describe("GetNotifications", () => {
	it("should call the endpoint and return the data", async () => {
		// @ts-ignore
		(axios.get as vi.Mock).mockImplementation(() =>
			Promise.resolve({ data: "test" }),
		);
		const result = await GetNotifications("token");
		expect(axios.get).toHaveBeenCalled();
		expect(result).toEqual("test");
	});

	it("should throw an error when it fails", async () => {
		// @ts-ignore
		(axios.get as vi.Mock).mockImplementation(() =>
			Promise.reject({ response: "test" }),
		);
		await expect(GetNotifications("token")).rejects.toThrow(Error);
		expect(axios.get).toHaveBeenCalled();
	});

	it("should throw an error when it fails", async () => {
		// @ts-ignore
		(axios.get as vi.Mock).mockImplementation(() =>
			Promise.reject({ response: { data: { message: "test" } } }),
		);
		// @ts-ignore
		(axios.isAxiosError as vi.Mock).mockImplementation(() => true);
		await expect(GetNotifications("token")).rejects.toThrow(Error);
		expect(axios.get).toHaveBeenCalled();
	});
});
