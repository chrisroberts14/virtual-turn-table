import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import SongControls from "../../src/components/SongControls";
import { useSongControl } from "../../src/contexts/SongControlContext";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { useError } from "../../src/contexts/ErrorContext";
import { useMusic } from "../../src/contexts/MusicContext";
import { useSpotifyToken } from "../../src/contexts/SpotifyTokenContext";
import type Album from "../../src/interfaces/Album";
import type Song from "../../src/interfaces/Song";

vi.mock("../../src/contexts/SongControlContext");
vi.mock("../../src/contexts/MusicContext");
vi.mock("../../src/contexts/ErrorContext");
vi.mock("../../src/contexts/SpotifyTokenContext");

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

const album: Album = {
	title: "title",
	artists: ["artist"],
	image_url: "image_url",
	album_uri: "album_uri",
	tracks_url: "tracks_url",
	songs: [mockSong, mockSong2],
} as Album;

const player = {
	togglePlay: vi.fn(),
};
const isPaused = true;
let currentSong = {};
const setCurrentSong = vi.fn();
const isPlayerReady = true;
const setTrackDuration = vi.fn();
const setIsPaused = vi.fn();

describe("SongControls", () => {
	beforeEach(() => {
		// @ts-ignore
		(useSongControl as vi.mock).mockReturnValue({
			player,
			isPaused,
			currentSong,
			setCurrentSong,
			isPlayerReady,
			setTrackDuration,
			setIsPaused,
		});

		// @ts-ignore
		(useMusic as vi.mock).mockReturnValue({
			currentAlbum: album,
			setCurrentAlbum: vi.fn(),
		});

		// @ts-ignore
		(useError as vi.mock).mockReturnValue({
			showError: vi.fn(),
		});

		// @ts-ignore
		(useSpotifyToken as vi.mock).mockReturnValue({
			token: "token",
		});
	});

	it("should render", () => {
		render(<SongControls />);
		waitFor(() => {
			expect(screen.getByTitle("Song Controls")).toBeInTheDocument();
		});
	});

	it("should call togglePlayPause when the play/pause button is clicked", async () => {
		render(<SongControls />);
		await waitFor(() => {
			expect(screen.getByTitle("Play/Pause")).toBeInTheDocument();
		});

		await userEvent.click(screen.getByTitle("Play/Pause"));

		await waitFor(() => {
			expect(player.togglePlay).toHaveBeenCalled();
			expect(setIsPaused).toHaveBeenCalled();
		});
	});

	it("should call nextSong when the next track button is clicked", async () => {
		currentSong = mockSong;
		// @ts-ignore
		(useSongControl as vi.mock).mockReturnValue({
			player,
			isPaused,
			currentSong,
			setCurrentSong,
			isPlayerReady,
			setTrackDuration,
			setIsPaused,
		});
		render(<SongControls />);
		await waitFor(() => {
			expect(screen.getByTitle("Next Track")).toBeInTheDocument();
		});

		await userEvent.click(screen.getByTitle("Next Track"));

		await waitFor(() => {
			expect(setIsPaused).toHaveBeenCalled();
			expect(setCurrentSong).toHaveBeenCalled();
			expect(setTrackDuration).toHaveBeenCalled();
		});
	});

	it("should call prevSong when the previous track button is clicked", async () => {
		currentSong = mockSong2;
		// @ts-ignore
		(useSongControl as vi.mock).mockReturnValue({
			player,
			isPaused,
			currentSong,
			setCurrentSong,
			isPlayerReady,
			setTrackDuration,
			setIsPaused,
		});
		render(<SongControls />);
		await waitFor(() => {
			expect(screen.getByTitle("Previous Track")).toBeInTheDocument();
		});

		await userEvent.click(screen.getByTitle("Previous Track"));

		await waitFor(() => {
			expect(setIsPaused).toHaveBeenCalled();
			expect(setCurrentSong).toHaveBeenCalled();
			expect(setTrackDuration).toHaveBeenCalled();
		});
	});
});
