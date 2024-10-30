import axios from "axios";
import { vi } from "vitest";
import AddAlbum from "../../src/api_calls/AddAlbum";
import "@testing-library/jest-dom";

vi.mock("axios");

describe("Add album routine", () => {
	it("runs", () => {
		// @ts-ignore
		(axios.post as vi.Mock).mockImplementation(() => Promise.resolve());
		const username = "test_user";
		const albumURI = "test_uri";
		AddAlbum(username, albumURI);
		expect(axios.post).toHaveBeenCalled();
	});

	it("throws an error when it fails", async () => {
		// @ts-ignore
		(axios.post as vi.Mock).mockImplementation(() =>
			Promise.reject({ response: { data: { message: "test" } } }),
		);
		const username = "test_user";
		const albumURI = "test_uri";
		await expect(AddAlbum(username, albumURI)).rejects.toThrow(Error);
		expect(axios.post).toHaveBeenCalled();
	});
});
