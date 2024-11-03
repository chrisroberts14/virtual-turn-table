import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import VolumeScrubber from "../../src/components/VolumeScrubber";
import { useSongControl } from "../../src/contexts/SongControlContext";
import "@testing-library/jest-dom";

vi.mock("./../../src/contexts/SongControlContext");

describe("VolumeScrubber", () => {
	const mockSetVolume = vi.fn();

	beforeEach(() => {
		// @ts-ignore
		(useSongControl as vi.mock).mockReturnValue({
			player: { setVolume: mockSetVolume },
		});
	});

	it("should render", async () => {
		render(<VolumeScrubber />);
		expect(screen.getByTitle("Volume")).toBeInTheDocument();
	});
});
