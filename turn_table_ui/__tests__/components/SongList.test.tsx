import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import SongList from "../../src/components/SongList";
import { useMusic } from "../../src/contexts/MusicContext";
import { useSongControl } from "../../src/contexts/SongControlContext";
import type Album from "../../src/interfaces/Album";
import type Song from "../../src/interfaces/Song";

vi.mock("../../src/contexts/MusicContext");
vi.mock("../../src/contexts/SongControlContext");

const mockSong: Song = {
	artists: ["artist"],
	duration_ms: 1000,
	uri: "uri",
	title: "title",
	album_uri: "album_uri",
} as Song;

const mockSong2: Song = {
	artists: ["artist"],
	duration_ms: 1000,
	uri: "uri",
	title: "title2",
	album_uri: "album_uri",
} as Song;

const mockAlbum: Album = {
	title: "title",
	artists: ["artist"],
	image_url: "image_url",
	album_uri: "album_uri",
	tracks_url: "tracks_url",
	songs: [mockSong, mockSong2],
} as Album;

describe("SongList", () => {
	beforeEach(() => {
		// @ts-ignore
		(useSongControl as vi.mock).mockReturnValue({
			currentSong: mockSong,
			setCurrentSong: vi.fn(),
			setTrackDuration: vi.fn(),
			setIsPaused: vi.fn(),
		});

		// @ts-ignore
		(useMusic as vi.mock).mockReturnValue({
			currentAlbum: mockAlbum,
		});
	});

	it("should render", () => {
		render(<SongList />);
	});

	it("should update the song if item is clicked", () => {
		render(<SongList />);
		const secondSong = screen.getByText("title2");
		userEvent.click(secondSong);
		waitFor(() => {
			expect(useSongControl().setCurrentSong).toHaveBeenCalledWith(mockSong2);
			expect(useSongControl().setTrackDuration).toHaveBeenCalledWith(1000);
		});
	});

	it("should update the song if item is un-clicked", () => {
		render(<SongList />);
		const firstSong = screen.getByText("title");
		userEvent.click(firstSong);
		waitFor(() => {
			expect(useSongControl().setCurrentSong).toHaveBeenCalledWith(null);
			expect(useSongControl().setTrackDuration).toHaveBeenCalledWith(0);
		});
	});
});
