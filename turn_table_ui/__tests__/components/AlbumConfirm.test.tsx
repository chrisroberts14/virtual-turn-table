import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import AddAlbum from "../../src/api_calls/AddAlbum";
import AlbumConfirm from "../../src/components/AlbumConfirm";
import { useMusic } from "../../src/contexts/MusicContext";
import { useUpload } from "../../src/contexts/UploadContext";
import { useUsername } from "../../src/contexts/UsernameContext";
import type Album from "../../src/interfaces/Album";
import "@testing-library/jest-dom";

vi.mock("../../src/contexts/UsernameContext");
vi.mock("../../src/contexts/MusicContext");
vi.mock("../../src/contexts/UploadContext");
vi.mock("../../src/api_calls/AddAlbum");

describe("AlbumConfirm", () => {
	const album: Album = {
		title: "title",
		artists: ["artist"],
		image_url: "image_url",
		album_uri: "album_uri",
		tracks_url: "tracks_url",
		songs: [],
	} as Album;

	beforeEach(() => {
		// @ts-ignore
		(useUsername as vi.mock).mockReturnValue({
			username: "test_user",
		});

		// @ts-ignore
		(useMusic as vi.mock).mockReturnValue({
			setCurrentAlbum: vi.fn(),
		});

		// @ts-ignore
		(useUpload as vi.mock).mockReturnValue({
			scannedAlbum: album,
			setScannedAlbum: vi.fn(),
			fadeConfirm: true,
			setFadeConfirm: vi.fn(),
			setCurrentImage: vi.fn(),
		});

		// @ts-ignore
		(AddAlbum as vi.mock).mockReturnValue(Promise.resolve());
	});

	it("should render", async () => {
		render(<AlbumConfirm />);
	});

	it("should set albums to null when rejectAlbum is called", async () => {
		render(<AlbumConfirm />);
		await waitFor(async () => {
			await userEvent.click(screen.getByText("No"));
			expect(useMusic().setCurrentAlbum).toHaveBeenCalledWith(null);
			expect(useUpload().setScannedAlbum).toHaveBeenCalledWith(null);
			expect(useUpload().setCurrentImage).toHaveBeenCalledWith(null);
		});
	});

	it("should set the correct values when confirmAlbum is called", async () => {
		render(<AlbumConfirm />);
		await waitFor(async () => {
			await userEvent.click(screen.getByText("Yes"));
			expect(useMusic().setCurrentAlbum).toHaveBeenCalledWith(album);
			expect(useUpload().setScannedAlbum).toHaveBeenCalledWith(null);
			expect(useUpload().setFadeConfirm).toHaveBeenCalledWith(false);
			expect(useUpload().setCurrentImage).toHaveBeenCalledWith(null);
			expect(AddAlbum).toHaveBeenCalledWith("test_user", "album_uri");
		});
	});

	it("should put an error in the console if the album was failed to be added to the users collection", async () => {
		// @ts-ignore
		(AddAlbum as vi.mock).mockImplementation(() =>
			Promise.reject(new Error("test_error")),
		);
		console.error = vi.fn();

		render(<AlbumConfirm />);
		await waitFor(async () => {
			await userEvent.click(screen.getByText("Yes"));
			expect(console.error).toHaveBeenCalled();
		});
	});

	it("should set buttonsDisabled to true when scannedAlbum is set to null", async () => {
		// @ts-ignore
		(useUpload as vi.mock).mockReturnValue({
			scannedAlbum: null,
			setScannedAlbum: vi.fn(),
			fadeConfirm: true,
			setFadeConfirm: vi.fn(),
			setCurrentImage: vi.fn(),
		});
		render(<AlbumConfirm />);
		await waitFor(async () => {
			const yesButton = screen.getByText("Yes");
			const noButton = screen.getByText("No");
			await userEvent.click(screen.getByText("No"));
			expect(yesButton).toBeDisabled();
			expect(noButton).toBeDisabled();
		});
	});
});
