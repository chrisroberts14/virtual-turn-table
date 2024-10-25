import { vi } from "vitest";

vi.mock("../types", () => ({
	// Mock any dependencies like SpotifyPlayer if needed
	SpotifyPlayer: jest.fn().mockImplementation(() => ({
		connect: jest.fn(),
		getCurrentState: jest.fn(),
		on: jest.fn(),
	})),
}));

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
		mockPlayer = new SpotifyPlayer();
		mockSetDeviceId = jest.fn();
		mockSetPlayer = jest.fn();
		mockSetIsPlayerReady = jest.fn();
		mockSetTrackPosition = jest.fn();
		mockSetCurrentSong = jest.fn();
		mockCurrentAlbum = {
			songs: [{ title: "Song 1" }, { title: "Song 2" }],
		} as Album; // Example album

		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.useRealTimers();
	});

	test("should connect to the Spotify player and set device ID when ready", async () => {
		const mockDeviceId = "test-device-id";

		// Mock the player connection and ready event
		(mockPlayer.connect as jest.Mock).mockResolvedValue(true);
		(mockPlayer.on as jest.Mock).mockImplementation((event, callback) => {
			if (event === "ready") {
				callback({ device_id: mockDeviceId });
			}
		});

		await act(async () => {
			await PlayerSetup(
				mockPlayer,
				mockSetDeviceId,
				mockSetPlayer,
				mockSetIsPlayerReady,
				mockSetTrackPosition,
				mockSetCurrentSong,
				mockCurrentAlbum,
			);
		});

		expect(mockPlayer.connect).toHaveBeenCalled();
		expect(mockSetDeviceId).toHaveBeenCalledWith(mockDeviceId);
		expect(mockSetPlayer).toHaveBeenCalledWith(mockPlayer);
		expect(mockSetIsPlayerReady).toHaveBeenCalledWith(true);
	});

	test("should update track position on interval", async () => {
		const mockState = {
			position: 1000,
			duration: 3000,
			paused: false,
			track_window: { current_track: { name: "Song 1" } },
		};

		// Mock the player state and interval behavior
		(mockPlayer.connect as jest.Mock).mockResolvedValue(true);
		(mockPlayer.getCurrentState as jest.Mock).mockResolvedValue(mockState);
		(mockPlayer.on as jest.Mock).mockImplementation((event, callback) => {
			if (event === "ready") {
				callback({ device_id: "test-device-id" });
			}
		});

		await act(async () => {
			await PlayerSetup(
				mockPlayer,
				mockSetDeviceId,
				mockSetPlayer,
				mockSetIsPlayerReady,
				mockSetTrackPosition,
				mockSetCurrentSong,
				mockCurrentAlbum,
			);
		});

		// Fast-forward time to trigger the interval
		jest.advanceTimersByTime(500);

		expect(mockPlayer.getCurrentState).toHaveBeenCalled();
		expect(mockSetTrackPosition).toHaveBeenCalledWith(mockState.position);
	});

	test("should handle player going offline", async () => {
		// Mock player connection and not_ready event
		(mockPlayer.connect as jest.Mock).mockResolvedValue(true);
		(mockPlayer.on as jest.Mock).mockImplementation((event, callback) => {
			if (event === "ready") {
				callback({ device_id: "test-device-id" });
			} else if (event === "not_ready") {
				callback({ device_id: "test-device-id" });
			}
		});

		await act(async () => {
			await PlayerSetup(
				mockPlayer,
				mockSetDeviceId,
				mockSetPlayer,
				mockSetIsPlayerReady,
				mockSetTrackPosition,
				mockSetCurrentSong,
				mockCurrentAlbum,
			);
		});

		expect(mockSetIsPlayerReady).toHaveBeenCalledWith(false);
	});

	test("should handle failed connection gracefully", async () => {
		(mockPlayer.connect as jest.Mock).mockResolvedValue(false);

		await expect(
			act(async () => {
				await PlayerSetup(
					mockPlayer,
					mockSetDeviceId,
					mockSetPlayer,
					mockSetIsPlayerReady,
					mockSetTrackPosition,
					mockSetCurrentSong,
					mockCurrentAlbum,
				);
			}),
		).rejects.toThrow("Failed to connect to Spotify player.");
	});
});
