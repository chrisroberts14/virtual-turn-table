import axios from "axios";
import { vi } from "vitest";
import GetUserInfo from "../../src/api_calls/GetUserInfo";

vi.mock("axios");

describe("GetUserInfo", () => {
	it("should return data", () => {
		const token = "test_token";
		// @ts-ignore
		(axios.get as vi.Mock).mockImplementation(() =>
			Promise.resolve({ data: "test" }),
		);
		expect(GetUserInfo(token)).resolves.toEqual("test");
		expect(axios.get).toHaveBeenCalled();
	});

	it("should throw an axios error when it fails", async () => {
		const token = "test_token";
		// @ts-ignore
		(axios.get as vi.Mock).mockImplementation(() =>
			Promise.reject({ response: { data: { message: "test" } } }),
		);
		// @ts-ignore
		(axios.isAxiosError as vi.Mock).mockImplementation(() => true);
		await expect(GetUserInfo(token)).rejects.toThrow(Error);
		expect(axios.get).toHaveBeenCalled();
	});

	it("should throw a non axios error when it fails", async () => {
		const token = "test_token";
		// @ts-ignore
		(axios.get as vi.Mock).mockImplementation(() =>
			Promise.reject({ response: { data: { message: "test" } } }),
		);
		// @ts-ignore
		(axios.isAxiosError as vi.Mock).mockImplementation(() => false);
		await expect(GetUserInfo(token)).rejects.toThrow(Error);
		expect(axios.get).toHaveBeenCalled();
	});
});
