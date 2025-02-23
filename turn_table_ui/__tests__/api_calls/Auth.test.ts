import axios from "axios";
import { vi } from "vitest";
import getToken from "../../src/api_calls/Auth";
import "@testing-library/jest-dom";

vi.mock("axios");

describe("Auth routine", () => {
	const token = "test_token";

	it("runs", () => {
		// @ts-ignore
		(axios.post as vi.Mock).mockImplementation(() =>
			Promise.resolve({ data: { access_token: "test" } }),
		);
		getToken(token);
		expect(axios.post).toHaveBeenCalled();
	});

	it("throws an error when it fails", async () => {
		// @ts-ignore
		(axios.post as vi.Mock).mockImplementation(() =>
			Promise.reject({ response: { data: { message: "test" } } }),
		);
		await expect(getToken(token)).rejects.toThrow(Error);
		expect(axios.post).toHaveBeenCalled();
	});
});
