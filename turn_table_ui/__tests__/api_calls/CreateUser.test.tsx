import axios from "axios";
import { vi } from "vitest";
import CreateUser from "../../src/api_calls/CreateUser";

vi.mock("axios");

describe("CreateUser", () => {
	it("runs", () => {
		// @ts-ignore
		(axios.post as vi.Mock).mockImplementation(() =>
			Promise.resolve({ data: "test" }),
		);
		const username = "test_user";
		const img_url = "test_url";
		CreateUser(username, img_url);
		expect(axios.post).toHaveBeenCalled();
	});

	it("throws an error when it fails", async () => {
		// @ts-ignore
		(axios.post as vi.Mock).mockImplementation(() =>
			Promise.reject({ response: "test" }),
		);
		const username = "test_user";
		const img_url = "test_url";
		await expect(CreateUser(username, img_url)).rejects.toThrow(Error);
		expect(axios.post).toHaveBeenCalled();
	});

	it("throws an error when it fails", async () => {
		// @ts-ignore
		(axios.post as vi.Mock).mockImplementation(() =>
			Promise.reject({ response: { data: { message: "test" } } }),
		);
		// @ts-ignore
		(axios.isAxiosError as vi.Mock).mockImplementation(() => true);
		const username = "test_user";
		const email = "test_email";
		await expect(CreateUser(username, email)).rejects.toThrow(Error);
		expect(axios.post).toHaveBeenCalled();
	});
});
