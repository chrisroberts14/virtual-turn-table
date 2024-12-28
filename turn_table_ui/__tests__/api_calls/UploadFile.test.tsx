import axios from "axios";
import { type Dispatch, type SetStateAction, act } from "react";
import { vi } from "vitest";
import UploadFile from "../../src/api_calls/UploadFile";
import type Album from "../../src/interfaces/Album";

vi.mock("axios");

describe("UploadFile", () => {
	let mockFile: File;
	let mockSetScannedAlbum: Dispatch<SetStateAction<Album | null>>;
	let mockSetTop10: Dispatch<SetStateAction<Album[]>>;

	beforeEach(() => {
		mockFile = new File([""], "test.jpg", { type: "image/jpeg" });
		mockSetScannedAlbum = vi.fn();
		mockSetTop10 = vi.fn();
	});

	it("should set the scanned album", async () => {
		// @ts-ignore
		(axios.post as vi.Mock).mockImplementation(() =>
			Promise.resolve({
				data: {
					best_guess: { title: "Song 1" },
					top_10_results: [{ title: "Song 1" }, { title: "Song 2" }],
				},
			}),
		);
		await act(async () => {
			await UploadFile(mockFile, mockSetScannedAlbum, mockSetTop10);
		});

		expect(mockSetScannedAlbum).toHaveBeenCalledWith({ title: "Song 1" });
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
