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
		const email = "test_email";
		CreateUser(username, email);
		expect(axios.post).toHaveBeenCalled();
	});

	it("throws an error when it fails", async () => {
		// @ts-ignore
		(axios.post as vi.Mock).mockImplementation(() =>
			Promise.reject({ response: "test" }),
		);
		const username = "test_user";
		const email = "test_email";
		await expect(CreateUser(username, email)).rejects.toThrow(Error);
		expect(axios.post).toHaveBeenCalled();
	});
});
