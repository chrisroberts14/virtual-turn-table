import { render } from "@testing-library/react";
import { vi } from "vitest";
import SongDetails from "../../src/components/SongDetails";
import { useSongControl } from "../../src/contexts/SongControlContext";

vi.mock("../../src/contexts/SongControlContext");

describe("SongDetails", () => {
	beforeEach(() => {
		// @ts-ignore
		(useSongControl as vi.mock).mockReturnValue({
			currentSong: {
				title: "Title",
				artists: "Artists",
			},
		});
	});

	it("should render", () => {
		render(<SongDetails />);
	});
});
