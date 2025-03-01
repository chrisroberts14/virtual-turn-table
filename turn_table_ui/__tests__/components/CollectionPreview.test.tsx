import { render } from "@testing-library/react";
import { vi } from "vitest";
import { CollectionPreviewHorizontal } from "../../src/components/CollectionPreview";
import { useCollection } from "../../src/contexts/CollectionContext";
import { useMusic } from "../../src/contexts/MusicContext";
import type Album from "../../src/interfaces/Album";

vi.mock("../../src/contexts/CollectionContext");
vi.mock("../../src/contexts/MusicContext");

const mockAlbum: Album = {
	title: "title",
	artists: ["artist"],
	image_url: "image_url",
	album_uri: "album_uri",
	tracks_url: "tracks_url",
	songs: [],
} as Album;

describe("CollectionPreviewHorizontal", () => {
	const setCurrentAlbumMock = vi.fn();
	beforeAll(() => {
		// @ts-ignore
		useCollection.mockReturnValue({ albums: [mockAlbum], username: "test" });
		// @ts-ignore
		useMusic.mockReturnValue({ setCurrentAlbum: setCurrentAlbumMock });
	});

	it("renders correctly", () => {
		render(<CollectionPreviewHorizontal />);
	});
});
