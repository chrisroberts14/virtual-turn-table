import { render } from "@testing-library/react";
import { vi } from "vitest";
import SpinningVinyl from "../../src/components/SpinningVinyl";
import { useMusic } from "../../src/contexts/MusicContext";
import { useSongControl } from "../../src/contexts/SongControlContext";

vi.mock("../../src/contexts/MusicContext.tsx");
vi.mock("../../src/contexts/SongControlContext.tsx");

describe("SpinningVinyl", () => {
	beforeAll(() => {
		// @ts-ignore
		(useMusic as vi.Mock).mockReturnValue({ currentAlbum: "album" });

		// @ts-ignore
		(useSongControl as vi.Mock).mockReturnValue({ isPaused: false });
	});

	it("renders", () => {
		render(<SpinningVinyl />);
	});
});
