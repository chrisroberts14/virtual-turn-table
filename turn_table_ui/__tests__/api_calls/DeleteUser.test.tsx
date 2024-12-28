import axios from "axios";
import { vi } from "vitest";
import DeleteUser from "../../src/api_calls/DeleteUser";

vi.mock("axios");

describe("DeleteUser", () => {
	it("should run", async () => {
		// @ts-ignore
		(axios.delete as vi.Mock).mockImplementation(() =>
			Promise.resolve({ data: "test" }),
		);
		const username = "test_user";
		await DeleteUser(username);
		expect(axios.delete).toHaveBeenCalled();
	});

	it("should throw an error when it fails", async () => {
		// @ts-ignore
		(axios.delete as vi.Mock).mockImplementation(() =>
			Promise.reject({ response: "test" }),
		);
		const username = "test_user";
		await expect(DeleteUser(username)).rejects.toThrow(Error);
		expect(axios.delete).toHaveBeenCalled();
	});

	it("should throw an error when it fails", async () => {
		// @ts-ignore
		(axios.delete as vi.Mock).mockImplementation(() =>
			Promise.reject({ response: { data: { message: "test" } } }),
		);
		// @ts-ignore
		(axios.isAxiosError as vi.Mock).mockImplementation(() => true);
		const username = "test_user";
		await expect(DeleteUser(username)).rejects.toThrow(Error);
		expect(axios.delete).toHaveBeenCalled();
	});
});
