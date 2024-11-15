import axios from "axios";
import { vi } from "vitest";
import ToggleCollectionPublic from "../../src/api_calls/ToggleCollectionPublic";

vi.mock("axios");

describe("ToggleCollectionPublic", () => {
	it("should return the new value", () => {
		// @ts-ignore
		(axios.put as vi.Mock).mockImplementation(() => Promise.resolve(true));
		expect(ToggleCollectionPublic("username")).resolves.toEqual(true);
	});

	it("should throw an error when it fails", () => {
		// @ts-ignore
		(axios.put as vi.Mock).mockImplementation(() =>
			Promise.reject({ response: { data: { message: "test" } } }),
		);
		expect(ToggleCollectionPublic("username")).rejects.toThrow(Error);
	});
});
