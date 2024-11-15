import { render, screen, waitFor } from "@testing-library/react";
import SocialPage from "../../src/components/SocialPage";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import GetAlbumDetails from "../../src/api_calls/GetAlbumDetails";
import GetPublicCollections from "../../src/api_calls/GetPublicCollections";
import GetSharedCollections from "../../src/api_calls/GetSharedCollections";
import GetUserAlbums from "../../src/api_calls/GetUserAlbums";
import { useError } from "../../src/contexts/ErrorContext";
import { useMusic } from "../../src/contexts/MusicContext";
import { useSpotifyToken } from "../../src/contexts/SpotifyTokenContext";
import { useUsername } from "../../src/contexts/UsernameContext";
import type Album from "../../src/interfaces/Album";
import type Collection from "../../src/interfaces/Collection";

vi.mock("../../src/contexts/SpotifyTokenContext");
vi.mock("../../src/contexts/UsernameContext");
vi.mock("../../src/api_calls/GetPublicCollections");
vi.mock("../../src/api_calls/GetSharedCollections");
vi.mock("../../src/contexts/ErrorContext");
vi.mock("../../src/contexts/MusicContext");
vi.mock("../../src/api_calls/GetUserAlbums");
vi.mock("../../src/api_calls/GetAlbumDetails");

describe("SocialPage", () => {
	const album: Album = {
		title: "title",
		artists: ["artist"],
		image_url: "image_url",
		album_uri: "album_uri",
		tracks_url: "tracks_url",
		songs: [],
	} as Album;

	beforeEach(() => {
		vi.clearAllMocks();

		// @ts-ignore
		(useSpotifyToken as vi.mock).mockReturnValue({
			token: "token",
		});

		// @ts-ignore
		(useUsername as vi.mock).mockReturnValue({
			username: "username",
		});

		// @ts-ignore
		(GetPublicCollections as vi.mock).mockImplementation(() =>
			Promise.resolve([
				{ user_id: "test_user", albums: [album] } as Collection,
			]),
		);

		// @ts-ignore
		(GetSharedCollections as vi.mock).mockImplementation(() =>
			Promise.resolve([
				{ user_id: "test_user", albums: [album] } as Collection,
			]),
		);

		// @ts-ignore
		(useError as vi.mock).mockReturnValue({
			showError: vi.fn(),
		});

		// @ts-ignore
		(useMusic as vi.mock).mockReturnValue({
			setCurrentAlbum: vi.fn(),
		});

		// @ts-ignore
		(GetUserAlbums as vi.mock).mockImplementation(() =>
			Promise.resolve([album.album_uri]),
		);

		// @ts-ignore
		(GetAlbumDetails as vi.mock).mockImplementation(() =>
			Promise.resolve(album),
		);
	});

	it("should render", async () => {
		render(<SocialPage />);
		await waitFor(() => {
			expect(screen.getByText("Public Collections")).toBeInTheDocument();
			expect(screen.getByText("Shared With You")).toBeInTheDocument();
		});
	});

	it("should with no collections", async () => {
		// @ts-ignore
		(GetPublicCollections as vi.mock).mockImplementation(() =>
			Promise.resolve([]),
		);
		// @ts-ignore
		(GetSharedCollections as vi.mock).mockImplementation(() =>
			Promise.resolve([]),
		);

		render(<SocialPage />);
		await waitFor(() => {
			expect(
				screen.getByText("There are no public collections"),
			).toBeInTheDocument();
			expect(
				screen.getByText("You have no shared collections"),
			).toBeInTheDocument();
		});
	});

	it("should not render the current user's collections", async () => {
		// @ts-ignore
		(GetPublicCollections as vi.mock).mockImplementation(() =>
			Promise.resolve([{ user_id: "username", albums: [album] } as Collection]),
		);
		// @ts-ignore
		(GetSharedCollections as vi.mock).mockImplementation(() =>
			Promise.resolve([{ user_id: "username", albums: [album] } as Collection]),
		);

		render(<SocialPage />);
		await waitFor(() => {
			expect(
				screen.getByText("There are no public collections"),
			).toBeInTheDocument();
		});
	});

	it("should not fetch collections if token or username is not present", async () => {
		// @ts-ignore
		(useSpotifyToken as vi.mock).mockReturnValue({
			token: "",
		});

		// @ts-ignore
		(useUsername as vi.mock).mockReturnValue({
			username: "",
		});

		render(<SocialPage />);
		await waitFor(() => {
			expect(GetPublicCollections).not.toHaveBeenCalled();
			expect(GetSharedCollections).not.toHaveBeenCalled();
		});
	});

	it("should show error if fetching collections fails", async () => {
		// @ts-ignore
		(GetPublicCollections as vi.mock).mockImplementation(() =>
			Promise.reject(null),
		);
		// @ts-ignore
		(GetSharedCollections as vi.mock).mockImplementation(() =>
			Promise.reject(null),
		);

		render(<SocialPage />);
		await waitFor(() => {
			expect(useError().showError).toHaveBeenCalled();
		});
	});

	it("should render public collections even if current user is in them", async () => {
		// @ts-ignore
		(GetPublicCollections as vi.mock).mockImplementation(() =>
			Promise.resolve([
				{ user_id: "username", albums: [album] } as Collection,
				{ user_id: "username2", albums: [album] } as Collection,
			]),
		);
		render(<SocialPage />);

		await waitFor(() => {
			expect(screen.getByText("username2")).toBeInTheDocument();
		});
	});
});
