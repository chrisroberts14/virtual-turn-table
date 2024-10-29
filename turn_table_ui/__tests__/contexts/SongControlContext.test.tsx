import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import {
	SongControlContext,
	useSongControl,
} from "../../src/contexts/SongControlContext";

describe("SongControlContext", () => {
	it("should provide context values when used in a SongControl context", () => {
		const wrapper = ({ children }) => (
			<SongControlContext.Provider
				value={{
					isPaused: false,
					setIsPaused: vi.fn(),
					currentSong: null,
					setCurrentSong: vi.fn(),
					deviceId: "",
					setDeviceId: vi.fn(),
					player: null,
					setPlayer: vi.fn(),
					trackPosition: 0,
					setTrackPosition: vi.fn(),
					trackDuration: 0,
					setTrackDuration: vi.fn(),
					nextSong: null,
					setNextSong: vi.fn(),
					isPlayerReady: true,
					setIsPlayerReady: vi.fn(),
				}}
			>
				{children}
			</SongControlContext.Provider>
		);

		const { result } = renderHook(() => useSongControl(), { wrapper });

		expect(result.current).toBeDefined();
	});

	it("should throw an error when used outside a SongControl context", () => {
		expect(() => renderHook(() => useSongControl())).toThrow(
			"useSongControl must be used within a SongControlProvider",
		);
	});
});
