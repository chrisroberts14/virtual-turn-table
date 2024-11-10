import axios from "axios";
import { vi } from "vitest";
import ShareCollection from "../../src/api_calls/ShareCollection";

vi.mock("axios");

describe("ShareCollection", () => {
	const sharer = "sharer";
	const receiver = "receiver";

	it("should share collection", async () => {
		// @ts-ignore
		(axios.post as vi.Mock).mockImplementation(() =>
			Promise.resolve({ message: "test" }),
		);
		await expect(ShareCollection(sharer, receiver)).resolves.toEqual({
			message: "test",
		});
	});

	it("should throw an error when it fails", async () => {
		// @ts-ignore
		(axios.post as vi.Mock).mockImplementation(() =>
			Promise.reject({ response: { data: { message: "test" } } }),
		);
		await expect(ShareCollection(sharer, receiver)).rejects.toThrow(Error);
	});
});
