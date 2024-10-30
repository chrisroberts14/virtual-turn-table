import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import MusicPlayer from "../../src/components/MusicPlayer";
import { useError } from "../../src/contexts/ErrorContext";
import { useMusic } from "../../src/contexts/MusicContext";
import { useSpotifyToken } from "../../src/contexts/SpotifyTokenContext";
import "@testing-library/jest-dom";
import { act } from "react";
import PlayerSetup from "../../src/api_calls/PlayerSetup";
import type Album from "../../src/interfaces/Album";
import { getStateData } from "../../src/interfaces/StateData";

vi.mock("../../src/contexts/MusicContext");
vi.mock("../../src/contexts/ErrorContext");
vi.mock("../../src/contexts/SpotifyTokenContext");
vi.mock("../../src/api_calls/PlayerSetup");
vi.mock("../../src/interfaces/StateData");

interface Window {
	onSpotifyWebPlaybackSDKReady: () => void;
	Spotify: {
		Player: new (options: {
			name: string;
			getOAuthToken: (cb: (token: string) => void) => void;
			volume?: number;
		}) => SpotifyPlayer;
	};
}

interface SpotifyPlayerState {
	duration: number; // Total duration of the current track in milliseconds
	position: number; // Current playback position in milliseconds
	paused: boolean; // Whether the track is paused
	shuffle: boolean; // Whether shuffle mode is enabled
	repeat_mode: number; // Repeat mode (0: off, 1: context, 2: track)
	track_window: {
		current_track: {
			id: string; // The Spotify ID of the current track
			uri: string; // The URI of the current track
			name: string; // The name of the current track
			duration_ms: number; // Duration of the current track in milliseconds
			artists: Array<{
				name: string; // Name of the artist
				uri: string; // Spotify URI of the artist
			}>;
			album: {
				name: string; // Name of the album
				images: Array<{
					url: string; // URL of the album cover image
				}>;
			};
		};
		next_tracks: Array<{
			id: string; // The Spotify ID of the next track
			uri: string; // URI of the next track
			name: string; // Name of the next track
		}>;
		previous_tracks: Array<{
			id: string; // The Spotify ID of the previous track
			uri: string; // URI of the previous track
			name: string; // Name of the previous track
		}>;
	};
	context: {
		uri: string; // URI of the current playback context (playlist, album, etc.)
		metadata: {
			[key: string]: any; // Additional metadata about the context
		};
	};
}

interface SpotifyPlayer {
	connect: () => Promise<boolean>;
	disconnect: () => void;
	setVolume: (volume: number) => Promise<void>;
	seek: (positionMs: number) => Promise<void>;
	addListener: (
		event: string,
		callback: (state: SpotifyPlayerState) => void,
	) => void;
	on: (event: string, callback: (eventData: any) => void) => void;
	getCurrentState: () => Promise<SpotifyPlayerState>;
	togglePlay: () => Promise<void>;
}

describe("MusicPlayer", () => {
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
		(useMusic as vi.mock).mockReturnValue({
			currentAlbum: null,
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

		// @ts-ignore
		(getStateData as vi.mock).mockReturnValue({
			currentAlbum: null,
			currentSong: null,
		});

		// @ts-ignore
		(PlayerSetup as vi.mock).mockReturnValue(Promise.resolve());

		// @ts-ignore
		window.Spotify = {
			Player: vi.fn().mockImplementation(({ getOAuthToken }) => ({
				connect: vi.fn(),
				getOAuthToken: vi.fn((cb) => cb("mock_token")),
				volume: 0.5,
			})),
		};
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("should render", () => {
		render(<MusicPlayer />);
	});

	it("should render with current album", () => {
		// @ts-ignore
		(useMusic as vi.mock).mockReturnValue({
			currentAlbum: album,
			setCurrentAlbum: vi.fn(),
		});

		render(<MusicPlayer />);
	});

	it("should render with current album and player", async () => {
		// @ts-ignore
		(getStateData as vi.mock).mockReturnValue({
			currentAlbum: album,
			currentSong: null,
		});

		// @ts-ignore
		(useMusic as vi.mock).mockReturnValue({
			currentAlbum: album,
			setCurrentAlbum: vi.fn(),
		});

		// Create a specific container for rendering
		const container = document.createElement("div");
		container.id = "test-container"; // Give it an ID for easier debugging or querying
		document.body.appendChild(container); // Append it to the document body
		vi.spyOn(document.body, "appendChild").mockImplementation(() => undefined);
		render(<MusicPlayer />, { container });
		await act(async () => {
			// @ts-ignore
			await window.onSpotifyWebPlaybackSDKReady();
			await vi.waitFor(() => {
				expect(PlayerSetup).toHaveBeenCalled();
				expect(screen.getByTitle("Song Details")).toBeInTheDocument();
			});
		});
	});

	it("should output an error if the player setup fails", async () => {
		// @ts-ignore
		(PlayerSetup as vi.mock).mockReturnValue(
			Promise.reject(new Error("test_error")),
		);
		console.error = vi.fn();

		// Create a specific container for rendering
		const container = document.createElement("div");
		container.id = "test-container"; // Give it an ID for easier debugging or querying
		document.body.appendChild(container); // Append it to the document body
		vi.spyOn(document.body, "appendChild").mockImplementation(() => undefined);
		render(<MusicPlayer />, { container });
		await act(async () => {
			// @ts-ignore
			await window.onSpotifyWebPlaybackSDKReady();
			await vi.waitFor(() => {
				expect(PlayerSetup).toHaveBeenCalled();
				expect(console.error).toHaveBeenCalledWith("test_error");
			});
		});
	});
});
