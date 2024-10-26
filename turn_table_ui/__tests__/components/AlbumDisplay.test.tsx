import { render } from "@testing-library/react";
import AlbumDisplay from "../../src/components/AlbumDisplay";
import type Album from "../../src/interfaces/Album";

describe("AlbumDisplay", () => {
	it("should render", () => {
		const album: Album = {
			title: "title",
			artists: ["artist"],
			image_url: "image_url",
			album_uri: "album_uri",
			tracks_url: "tracks_url",
			songs: [],
		} as Album;
		render(<AlbumDisplay album={album} />);
	});
});
