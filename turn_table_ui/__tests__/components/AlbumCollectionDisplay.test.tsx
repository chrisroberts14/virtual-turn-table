import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import GetAlbumDetails from "../../src/api_calls/GetAlbumDetails";
import GetUserAlbums from "../../src/api_calls/GetUserAlbums";
import AlbumCollectionDisplay from "../../src/components/AlbumCollectionDisplay";
import { useAlbumSelection } from "../../src/contexts/AlbumSelectionContext";
import { BFFTokenContext } from "../../src/contexts/BFFTokenContext";
import { useError } from "../../src/contexts/ErrorContext";
import { useMusic } from "../../src/contexts/MusicContext";
import { useSpotifyToken } from "../../src/contexts/SpotifyTokenContext";
import { useUsername } from "../../src/contexts/UsernameContext";
import type Album from "../../src/interfaces/Album";
import eventEmitter from "../../src/utils/EventEmitter";

vi.mock("../../src/contexts/UsernameContext");
vi.mock("../../src/contexts/ErrorContext");
vi.mock("../../src/contexts/SpotifyTokenContext");
vi.mock("../../src/contexts/MusicContext");
vi.mock("../../src/contexts/AlbumSelectionContext");
vi.mock("../../src/api_calls/GetUserAlbums");
vi.mock("../../src/api_calls/GetAlbumDetails");

describe("AlbumCollectionDisplay", () => {
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
		(useSpotifyToken as vi.mock).mockReturnValue({
			token: "test_token",
		});

		// @ts-ignore
		(useError as vi.mock).mockReturnValue({
			showError: vi.fn(),
		});

		// @ts-ignore
		(useMusic as vi.mock).mockReturnValue({
			setCurrentAlbum: vi.fn(),
		});

		// @ts-ignore
		(useAlbumSelection as vi.mock).mockReturnValue({
			albums: [album],
			setAlbums: vi.fn(),
			setHoveredAlbum: vi.fn(),
		});

		// @ts-ignore
		(GetUserAlbums as vi.mock).mockReturnValue(
			Promise.resolve([album.album_uri]),
		);

		// @ts-ignore
		(GetAlbumDetails as vi.mock).mockReturnValue(Promise.resolve(album));
	});

	it("should render and set correct values", async () => {
		render(
			<BFFTokenContext.Provider
				value={{ BFFToken: "test_token", setBFFToken: vi.fn() }}
			>
				<AlbumCollectionDisplay />
			</BFFTokenContext.Provider>,
		);
		await waitFor(() => {
			expect(GetUserAlbums).toHaveBeenCalledWith("test_user", "test_token");
			expect(GetAlbumDetails).toHaveBeenCalledWith("album_uri", "test_token");
			expect(useAlbumSelection().setAlbums).toHaveBeenCalledWith([album]);
		});
	});

	it("should call setCurrentAlbum when an album is clicked", async () => {
		render(
			<BFFTokenContext.Provider
				value={{ BFFToken: "test_token", setBFFToken: vi.fn() }}
			>
				<AlbumCollectionDisplay />
			</BFFTokenContext.Provider>,
		);
		await waitFor(async () => {
			await userEvent.click(screen.getByAltText("title"));
			expect(useMusic().setCurrentAlbum).toHaveBeenCalledWith(album);
		});
	});

	it("should set hovered album when an album is hovered", async () => {
		render(
			<BFFTokenContext.Provider
				value={{ BFFToken: "test_token", setBFFToken: vi.fn() }}
			>
				<AlbumCollectionDisplay />
			</BFFTokenContext.Provider>,
		);
		await waitFor(async () => {
			await userEvent.hover(screen.getByAltText("title"));
			expect(useAlbumSelection().setHoveredAlbum).toHaveBeenCalledWith(album);
		});
	});

	it("should call showError when GetUserAlbums fails", async () => {
		// @ts-ignore
		(GetUserAlbums as vi.mock).mockReturnValue(
			Promise.reject(new Error("test_error")),
		);

		render(
			<BFFTokenContext.Provider
				value={{ BFFToken: "test_token", setBFFToken: vi.fn() }}
			>
				<AlbumCollectionDisplay />
			</BFFTokenContext.Provider>,
		);
		await waitFor(() => {
			expect(useError().showError).toHaveBeenCalledWith("test_error");
		});
	});

	it("should render if a collection was passed in", async () => {
		render(
			<BFFTokenContext.Provider
				value={{ BFFToken: "test_token", setBFFToken: vi.fn() }}
			>
				<AlbumCollectionDisplay albumCollection={{ albums: [album] }} />
			</BFFTokenContext.Provider>,
		);
		await waitFor(() => {
			expect(useAlbumSelection().setAlbums).toHaveBeenCalledWith([album]);
		});
	});

	it("should run the userAlbumUpdate method if albumAdded event is called", async () => {
		render(
			<BFFTokenContext.Provider
				value={{ BFFToken: "test_token", setBFFToken: vi.fn() }}
			>
				<AlbumCollectionDisplay />
			</BFFTokenContext.Provider>,
		);
		vi.clearAllMocks();
		eventEmitter.emit("albumAdded");
		await waitFor(() => {
			expect(GetUserAlbums).toHaveBeenCalled();
		});
	});
});
