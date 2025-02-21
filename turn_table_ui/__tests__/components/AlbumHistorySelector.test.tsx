import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import AlbumHistorySelector from "../../src/components/AlbumHistorySelector";
import { useError } from "../../src/contexts/ErrorContext";
import { MusicContext } from "../../src/contexts/MusicContext";
import { SpotifyTokenContext } from "../../src/contexts/SpotifyTokenContext";
import { UsernameContext } from "../../src/contexts/UsernameContext";
import type Album from "../../src/interfaces/Album";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import GetAlbumDetails from "../../src/api_calls/GetAlbumDetails";
import GetUserAlbums from "../../src/api_calls/GetUserAlbums";
import { BFFTokenContext } from "../../src/contexts/BFFTokenContext";

vi.mock("../../src/contexts/ErrorContext");
vi.mock("../../src/api_calls/GetUserAlbums");
vi.mock("../../src/api_calls/GetAlbumDetails");

describe("AlbumHistorySelector", () => {
	const setUsername = vi.fn();
	const username = "John Doe";
	const mockShowError = vi.fn();
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
		(useError as vi.Mock).mockReturnValue({ showError: mockShowError });
	});

	it("should render with no hovered album", () => {
		// @ts-ignore
		(GetUserAlbums as vi.mock).mockReturnValue(Promise.resolve([]));

		render(
			<UsernameContext.Provider value={{ username, setUsername }}>
				<SpotifyTokenContext.Provider
					value={{ spotifyToken: "valid_token", setSpotifyToken: vi.fn() }}
				>
					<BFFTokenContext.Provider
						value={{ BFFToken: "valid_token", setBFFToken: vi.fn() }}
					>
						<MusicContext.Provider
							value={{ currentAlbum: null, setCurrentAlbum: vi.fn() }}
						>
							<AlbumHistorySelector />
						</MusicContext.Provider>
					</BFFTokenContext.Provider>
				</SpotifyTokenContext.Provider>
			</UsernameContext.Provider>,
		);
	});

	it("should render with hovered album", async () => {
		// @ts-ignore
		(GetUserAlbums as vi.mock).mockReturnValue(
			Promise.resolve([album.album_uri]),
		);

		// @ts-ignore
		(GetAlbumDetails as vi.mock).mockReturnValue(Promise.resolve(album));

		render(
			<UsernameContext.Provider value={{ username, setUsername }}>
				<SpotifyTokenContext.Provider
					value={{ spotifyToken: "valid_token", setSpotifyToken: vi.fn() }}
				>
					<BFFTokenContext.Provider
						value={{ BFFToken: "valid_token", setBFFToken: vi.fn() }}
					>
						<MusicContext.Provider
							value={{ currentAlbum: null, setCurrentAlbum: vi.fn() }}
						>
							<AlbumHistorySelector />
						</MusicContext.Provider>
					</BFFTokenContext.Provider>
				</SpotifyTokenContext.Provider>
			</UsernameContext.Provider>,
		);

		await waitFor(async () => {
			await userEvent.hover(screen.getByAltText("title"));
			expect(screen.getByText("Album History")).toBeInTheDocument();
			expect(screen.getByText("title")).toBeInTheDocument();
			expect(screen.getByText("By artist")).toBeInTheDocument();
		});
	});
});
