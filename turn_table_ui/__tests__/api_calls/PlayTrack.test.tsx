import axios from "axios";
import { vi } from "vitest";
import { playTrack } from "../../src/api_calls/BFFEndpoints";
import PlayTrack from "../../src/api_calls/PlayTrack";

vi.mock("axios");

describe("PlayTrack", () => {
	it("should call axios.post with the correct parameters", async () => {
		// @ts-ignore
		(axios.post as vi.Mock).mockImplementation(() =>
			Promise.resolve({ data: "test" }),
		);
		await PlayTrack("test_token", "test_uri", "test_device_id");
		expect(axios.post).toHaveBeenCalledWith(playTrack, {
			spotify_access_token: "test_token",
			track_uri: "test_uri",
			device_id: "test_device_id",
		});
	});

	it("should throw an error if fails", async () => {
		// @ts-ignore
		(axios.post as vi.Mock).mockImplementation(() =>
			Promise.reject({ response: { data: { message: "failed" } } }),
		);
		// @ts-ignore
		(axios.isAxiosError as vi.Mock).mockImplementation(() => true);
		await expect(PlayTrack("token", "uri", "deviceid")).rejects.toThrow(Error);
		expect(axios.post).toHaveBeenCalled();
	});
});
