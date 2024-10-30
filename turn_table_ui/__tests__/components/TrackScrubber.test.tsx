import { render } from "@testing-library/react";
import { vi } from "vitest";
import TrackScrubber from "../../src/components/TrackScrubber";
import { useSongControl } from "../../src/contexts/SongControlContext";

vi.mock("../../src/contexts/SongControlContext");

describe("TrackScrubber", () => {
	beforeEach(() => {
		// @ts-ignore
		(useSongControl as vi.Mock).mockReturnValue({
			player: { seek: vi.fn() },
			trackPosition: 0,
			trackDuration: 0,
			isPlayerReady: true,
		});
	});

	it("renders a slider", () => {
		render(<TrackScrubber />);
	});
});
