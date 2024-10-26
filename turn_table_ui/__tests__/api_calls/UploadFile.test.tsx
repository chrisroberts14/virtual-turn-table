import axios from "axios";
import { type Dispatch, type SetStateAction, act } from "react";
import { vi } from "vitest";
import UploadFile from "../../src/api_calls/UploadFile";
import type Album from "../../src/interfaces/Album";

vi.mock("axios");

describe("UploadFile", () => {
	let mockFile: File;
	let mockSetScannedAlbum: Dispatch<SetStateAction<Album | null>>;

	beforeEach(() => {
		mockFile = new File([""], "test.jpg", { type: "image/jpeg" });
		mockSetScannedAlbum = vi.fn();
	});

	it("should set the scanned album", async () => {
		// @ts-ignore
		(axios.post as vi.Mock).mockImplementation(() =>
			Promise.resolve({
				data: {
					songs: [{ title: "Song 1" }, { title: "Song 2" }],
				} as Album,
			}),
		);
		await act(async () => {
			await UploadFile(mockFile, mockSetScannedAlbum);
		});

		expect(mockSetScannedAlbum).toHaveBeenCalledWith({
			songs: [{ title: "Song 1" }, { title: "Song 2" }],
		});
	});

	it("should throw an error if fails", async () => {
		// @ts-ignore
		(axios.post as vi.Mock).mockImplementation(() =>
			Promise.reject({ response: { data: { message: "failed" } } }),
		);
		// @ts-ignore
		await expect(UploadFile(mockFile, mockSetScannedAlbum)).rejects.toThrow(
			Error,
		);
		expect(axios.post).toHaveBeenCalled();
	});
});
