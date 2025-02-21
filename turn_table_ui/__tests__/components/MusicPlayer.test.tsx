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
import {useNavigation} from "../../src/contexts/NavigationContext";
import {BFFTokenContext, useBFFToken} from "../../src/contexts/BFFTokenContext";
import SocialPage from "../../src/components/SocialPage";

vi.mock("../../src/contexts/MusicContext");
vi.mock("../../src/contexts/ErrorContext");
vi.mock("../../src/contexts/SpotifyTokenContext");
vi.mock("../../src/api_calls/PlayerSetup");
vi.mock("../../src/interfaces/StateData");
vi.mock("../../src/contexts/NavigationContext");
vi.mock("../../src/contexts/BFFTokenContext");

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
			spotifyToken: "token",
		});

		// @ts-ignore
		(getStateData as vi.mock).mockReturnValue({
			currentAlbum: null,
			currentSong: null,
		});

		// @ts-ignore
		(PlayerSetup as vi.mock).mockReturnValue(Promise.resolve());

		// @ts-ignore
		(useNavigation as vi.mock).mockReturnValue({
			currentPage: 0,
			setCurrentPage: vi.fn(),
			isSignedIn: true,
		});

		//@ts-ignore
		(useBFFToken as vi.mock).mockReturnValue({
			BFFToken: "test_token",
			setBFFToken: vi.fn()
		});

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
		render(<MusicPlayer/>);
	});

	it("should render with current album", () => {
		// @ts-ignore
		(useMusic as vi.mock).mockReturnValue({
			currentAlbum: album,
			setCurrentAlbum: vi.fn(),
		});

		render(<MusicPlayer/>);
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
		render(<MusicPlayer />, {container});
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
		render(<MusicPlayer/>, {container})
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
