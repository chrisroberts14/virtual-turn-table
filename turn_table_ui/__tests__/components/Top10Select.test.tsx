import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import AddAlbum from "../../src/api_calls/AddAlbum";
import Top10Select from "../../src/components/Top10Select";
import { useMusic } from "../../src/contexts/MusicContext";
import { useUpload } from "../../src/contexts/UploadContext";
import { useUsername } from "../../src/contexts/UsernameContext";
import type Album from "../../src/interfaces/Album";

vi.mock("../../src/contexts/UploadContext");
vi.mock("../../src/contexts/UsernameContext");
vi.mock("../../src/contexts/MusicContext");
vi.mock("../../src/api_calls/AddAlbum");

const album: Album = {
	title: "title",
	artists: ["artist"],
	image_url: "image_url",
	album_uri: "album_uri",
	tracks_url: "tracks_url",
	songs: [],
} as Album;

const setScannedAlbumMock = vi.fn();
const setFadeConfirmMock = vi.fn();
const setCurrentImageMock = vi.fn();

describe("Top10Select", () => {
	beforeEach(() => {
		// @ts-ignore
		(useMusic as vi.mock).mockReturnValue({
			setCurrentAlbum: vi.fn(),
		});

		// @ts-ignore
		(useUsername as vi.mock).mockReturnValue({
			username: "test_user",
		});

		// @ts-ignore
		(useUpload as vi.mock).mockReturnValue({
			top10: [album],
			setScannedAlbum: setScannedAlbumMock,
			setFadeConfirm: setFadeConfirmMock,
			fadeConfirm: true,
			setCurrentImage: setCurrentImageMock,
		});

		// @ts-ignore
		(AddAlbum as vi.mock).mockReturnValue(Promise.resolve());
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("should render", async () => {
		render(<Top10Select />);
	});

	it("should close when album is clicked", async () => {
		render(<Top10Select />);
		await waitFor(async () => {
			await userEvent.click(screen.getByTitle("title"));
			expect(setFadeConfirmMock).toHaveBeenCalledTimes(1);
			expect(setFadeConfirmMock).toHaveBeenCalledWith(false);
			expect(setScannedAlbumMock).toHaveBeenCalledTimes(1);
			expect(setScannedAlbumMock).toHaveBeenCalledWith(null);
			expect(setCurrentImageMock).toHaveBeenCalledTimes(1);
			expect(setCurrentImageMock).toHaveBeenCalledWith(null);
		});
	});
});
