import axios from "axios";
import { vi } from "vitest";
import GetUsersBySearch from "../../src/api_calls/GetUsersBySearch";

vi.mock("axios");

describe("GetUsersBySearch", () => {
	const query = "query";

	it("should return users", () => {
		// @ts-ignore
		(axios.get as vi.Mock).mockImplementation(() =>
			Promise.resolve({ data: [] }),
		);
		expect(GetUsersBySearch(query)).resolves.toEqual([]);
	});

	it("should throw an axios error when it fails", () => {
		// @ts-ignore
		(axios.get as vi.Mock).mockImplementation(() =>
			Promise.reject({ response: { data: { message: "test" } } }),
		);
		// @ts-ignore
		(axios.isAxiosError as vi.Mock).mockImplementation(() => true);
		expect(GetUsersBySearch(query)).rejects.toThrow(Error);
	});

	it("should throw an non axios error when it fails", () => {
		// @ts-ignore
		(axios.get as vi.Mock).mockImplementation(() =>
			Promise.reject({ response: { data: { message: "test" } } }),
		);
		// @ts-ignore
		(axios.isAxiosError as vi.Mock).mockImplementation(() => false);
		expect(GetUsersBySearch(query)).rejects.toThrow(Error);
	});
});
