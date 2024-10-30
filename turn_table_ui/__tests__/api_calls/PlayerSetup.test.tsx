import { waitFor } from "@testing-library/react";
import { type Dispatch, type SetStateAction, act } from "react";
import { vi } from "vitest";
import PlayerSetup from "../../src/api_calls/PlayerSetup";
import type Album from "../../src/interfaces/Album";
import type Song from "../../src/interfaces/Song";

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

describe("PlayerSetup", () => {
	let mockPlayer: SpotifyPlayer;
	let mockSetDeviceId: Dispatch<SetStateAction<string>>;
	let mockSetPlayer: Dispatch<SetStateAction<SpotifyPlayer | null>>;
	let mockSetIsPlayerReady: Dispatch<SetStateAction<boolean>>;
	let mockSetTrackPosition: Dispatch<SetStateAction<number>>;
	let mockSetCurrentSong: Dispatch<SetStateAction<Song | null>>;
	let mockCurrentAlbum: Album | null;

	beforeEach(() => {
		// Initialize mocks and variables
		mockPlayer = {
			connect: vi.fn(),
			disconnect: vi.fn(),
			setVolume: vi.fn(),
			seek: vi.fn(),
			addListener: vi.fn(),
			on: vi.fn(),
			getCurrentState: vi.fn(),
			togglePlay: vi.fn(),
		};
		mockSetDeviceId = vi.fn();
		mockSetPlayer = vi.fn();
		mockSetIsPlayerReady = vi.fn();
		mockSetTrackPosition = vi.fn();
		mockSetCurrentSong = vi.fn();
		mockCurrentAlbum = {
			songs: [{ title: "Song 1" }, { title: "Song 2" }],
		} as Album; // Example album
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	test("should handle player going offline", async () => {
		// Mock player connection and not_ready event
		// @ts-ignore
		(mockPlayer.connect as vi.Mock).mockResolvedValue(true);
		// @ts-ignore
		(mockPlayer.on as vi.Mock).mockImplementation(
			(event: string, callback: (arg0: { device_id: string }) => void) => {
				if (event === "ready") {
					callback({ device_id: "test-device-id" });
				} else if (event === "not_ready") {
					callback({ device_id: "test-device-id" });
				}
			},
		);

		await act(async () => {
			await PlayerSetup(
				mockPlayer,
				mockSetIsPlayerReady,
				mockSetTrackPosition,
			);
		});

		expect(mockSetIsPlayerReady).toHaveBeenCalledWith(false);
	});

	test("should handle failed connection gracefully", async () => {
		// Mock player connection failure
		// @ts-ignore
		(mockPlayer.connect as vi.Mock).mockImplementation(() =>
			Promise.reject({ response: { data: { message: "test" } } }),
		);

		await expect(
			act(async () => {
				await PlayerSetup(
					mockPlayer,
					mockSetIsPlayerReady,
					mockSetTrackPosition,
				);
			}),
		).rejects.toThrow("Failed to connect to Spotify player.");
	});

	test("should throw error if success is false", async () => {
		// Mock player connection failure
		// @ts-ignore
		(mockPlayer.connect as vi.Mock).mockResolvedValue(false);

		await expect(
			act(async () => {
				await PlayerSetup(
					mockPlayer,
					mockSetIsPlayerReady,
					mockSetTrackPosition,
				);
			}),
		).rejects.toThrow("Failed to connect to Spotify player.");
	});

	test("player_state_changed event should update track position", async () => {
		const mockState = {
			position: 1000,
			duration: 3000,
			paused: false,
			track_window: { current_track: { name: "Song 1" } },
		};

		// Mock the player state and interval behavior
		// @ts-ignore
		(mockPlayer.connect as vi.Mock).mockResolvedValue(true);
		// @ts-ignore
		(mockPlayer.getCurrentState as vi.Mock).mockResolvedValue(mockState);
		// @ts-ignore
		(mockPlayer.on as vi.Mock).mockImplementation(
			(
				event: string,
				callback: (arg0: {
					position: number;
					duration: number;
					paused: boolean;
				}) => void,
			) => {
				if (event === "player_state_changed") {
					callback({ position: 2000, duration: 3000, paused: false });
				}
			},
		);

		await act(async () => {
			await PlayerSetup(
				mockPlayer,
				mockSetIsPlayerReady,
				mockSetTrackPosition,
			);
		});

		await waitFor(() => {
			expect(mockPlayer.on).toHaveBeenCalledWith(
				"player_state_changed",
				expect.any(Function),
			);
		});
	});
});
