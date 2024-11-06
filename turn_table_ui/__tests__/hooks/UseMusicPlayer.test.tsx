import { renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import UseMusicPlayer from "../../src/hooks/UseMusicPlayer";
import type Album from "../../src/interfaces/Album";
import { getStateData } from "../../src/interfaces/StateData";

import { act } from "react";
import PlayTrack from "../../src/api_calls/PlayTrack";
import PlayerSetup from "../../src/api_calls/PlayerSetup";
import { ErrorProvider } from "../../src/contexts/ErrorContext";
import { MusicContext } from "../../src/contexts/MusicContext";
import { NavigationContext } from "../../src/contexts/NavigationContext";
import { SpotifyTokenContext } from "../../src/contexts/SpotifyTokenContext";
import { UsernameContext } from "../../src/contexts/UsernameContext";
import type Song from "../../src/interfaces/Song";

vi.mock("../../src/interfaces/StateData");
vi.mock("../../src/api_calls/PlayerSetup");
vi.mock("../../src/api_calls/PlayTrack");
vi.mock("../../src/context/MusicContext");

const mockSong: Song = {
	artists: ["artist"],
	duration_ms: 1000,
	uri: "uri",
	title: "title",
	album_uri: "album_uri",
} as Song;

const album: Album = {
	title: "title",
	artists: ["artist"],
	image_url: "image_url",
	album_uri: "album_uri",
	tracks_url: "tracks_url",
	songs: [mockSong, mockSong],
} as Album;

const username = "username";
const setUsername = vi.fn();
const token = "token";
const setToken = vi.fn();
let currentAlbum = album;
const setCurrentAlbum = vi.fn();
const isSignedIn = true;
const setIsSignedIn = vi.fn();
const currentPage = 0;
const setCurrentPage = vi.fn();

describe("UseMusicPlayer", () => {
	const wrapper = ({ children }) => (
		<ErrorProvider>
			<UsernameContext.Provider value={{ username, setUsername }}>
				<SpotifyTokenContext.Provider value={{ token, setToken }}>
					<NavigationContext.Provider
						value={{ isSignedIn, setIsSignedIn, currentPage, setCurrentPage }}
					>
						<MusicContext.Provider
							value={{
								currentAlbum,
								setCurrentAlbum,
							}}
						>
							{children}
						</MusicContext.Provider>
					</NavigationContext.Provider>
				</SpotifyTokenContext.Provider>
			</UsernameContext.Provider>
		</ErrorProvider>
	);

	it("should initialise with album data", () => {
		// @ts-ignore
		(getStateData as vi.mock).mockReturnValue({
			currentAlbum: album,
			currentSong: mockSong,
		});

		const { result } = renderHook(() => UseMusicPlayer(), { wrapper });
		waitFor(() => {
			// Check that the state has been updated
			expect(result.current.currentSong).toEqual(mockSong);
			expect(result.current.trackDuration).toEqual(mockSong.duration_ms);
		});
	});

	it("should initialise without album data", () => {
		// @ts-ignore
		(getStateData as vi.mock).mockReturnValue({
			currentAlbum: null,
			currentSong: null,
		});

		const { result } = renderHook(() => UseMusicPlayer(), { wrapper });
		waitFor(() => {
			// Check that the state has been updated
			expect(result.current.currentSong).toBeNull();
			expect(result.current.trackDuration).toEqual(0);
		});
	});

	it("should create the player on render", () => {
		// @ts-ignore
		window.Spotify = {
			Player: vi.fn().mockImplementation(() => ({
				connect: vi.fn(),
				pause: vi.fn(),
				// Mock other methods as needed
			})),
		};
		// @ts-ignore
		(PlayerSetup as vi.mock).mockReturnValue(Promise.resolve());

		const { result } = renderHook(() => UseMusicPlayer(), { wrapper });
		// @ts-ignore
		window.onSpotifyWebPlaybackSDKReady();
		waitFor(() => {
			// @ts-ignore
			expect(window.Spotify.Player).toHaveBeenCalled();
			expect(result.current.player).not.toBeNull();
			expect(PlayerSetup).toHaveBeenCalled();
		});
	});

	it("should log and error if creating the player fails on render", () => {
		// @ts-ignore
		window.Spotify = {
			Player: vi.fn().mockImplementation(() => ({
				connect: vi.fn(),
				pause: vi.fn(),
				// Mock other methods as needed
			})),
		};
		// @ts-ignore
		(PlayerSetup as vi.mock).mockImplementation(() =>
			Promise.reject(new Error("test_error")),
		);
		console.error = vi.fn();

		const { result } = renderHook(() => UseMusicPlayer(), { wrapper });
		// @ts-ignore
		window.onSpotifyWebPlaybackSDKReady();
		waitFor(() => {
			expect(console.error).toHaveBeenCalledWith("test_error");
		});
	});

	it("should update the songs when the current album changes", () => {
		// @ts-ignore
		(getStateData as vi.mock).mockReturnValue({
			currentAlbum: album,
			currentSong: null,
		});

		// @ts-ignore
		(PlayTrack as vi.mock).mockReturnValue(Promise.resolve());

		const { result } = renderHook(() => UseMusicPlayer(), { wrapper });
		act(() => {
			result.current.setIsPlayerReady(true);
		});

		waitFor(() => {
			expect(result.current.currentSong).toEqual(mockSong);
			expect(result.current.nextSong).toEqual(mockSong);
		});
	});

	it("should update next song when the current song changes", () => {
		// @ts-ignore
		(getStateData as vi.mock).mockReturnValue({
			currentAlbum: album,
			currentSong: mockSong,
		});

		// @ts-ignore
		(PlayTrack as vi.mock).mockReturnValue(Promise.resolve());

		const { result } = renderHook(() => UseMusicPlayer(), { wrapper });
		act(() => {
			result.current.setIsPlayerReady(true);
			result.current.setDeviceId("device_id");
			result.current.setCurrentSong(mockSong);
		});

		waitFor(() => {
			expect(result.current.currentSong).toEqual(mockSong);
			expect(result.current.nextSong).toEqual(mockSong);
			expect(result.current.trackDuration).toEqual(mockSong.duration_ms);
		});
	});

	it("should set the next song to null if the current song is the last song on the album", () => {
		const album2: Album = {
			title: "title",
			artists: ["artist"],
			image_url: "image_url",
			album_uri: "album_uri",
			tracks_url: "tracks_url",
			songs: [mockSong],
		} as Album;

		// @ts-ignore
		(getStateData as vi.mock).mockReturnValue({
			currentAlbum: album2,
			currentSong: mockSong,
		});

		currentAlbum = album2;

		const { result } = renderHook(() => UseMusicPlayer(), { wrapper });

		act(() => {
			result.current.setIsPlayerReady(true);
			result.current.setCurrentSong(mockSong);
		});
		waitFor(() => {
			expect(result.current.nextSong).toBeNull();
		});
	});

	it("should show an error if the play track call fails", () => {
		// @ts-ignore
		(getStateData as vi.mock).mockReturnValue({
			currentAlbum: album,
			currentSong: mockSong,
		});

		// @ts-ignore
		(PlayTrack as vi.mock).mockImplementation(() =>
			Promise.reject(new Error("test_error")),
		);

		const { result } = renderHook(() => UseMusicPlayer(), { wrapper });

		act(() => {
			result.current.setIsPlayerReady(true);
			result.current.setDeviceId("device_id");
			result.current.setCurrentSong(mockSong);
		});
	});
});
