import { render } from "@testing-library/react";
import { act } from "react";
import { vi } from "vitest";
import ScanPage from "../../src/components/ScanPage";
import { useError } from "../../src/contexts/ErrorContext";
import { useMusic } from "../../src/contexts/MusicContext";
import { useSpotifyToken } from "../../src/contexts/SpotifyTokenContext";
import { useUsername } from "../../src/contexts/UsernameContext";

vi.mock("../../src/contexts/UsernameContext");
vi.mock("../../src/contexts/MusicContext");
vi.mock("../../src/contexts/ErrorContext");
vi.mock("../../src/contexts/SpotifyTokenContext");

describe("ScanPage", () => {
	beforeEach(() => {
		// @ts-ignore
		(useUsername as vi.mock).mockReturnValue({
			username: "test",
		});

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
			token: "token",
		});

		// Define navigator.mediaDevices if it's not already defined
		if (!navigator.mediaDevices) {
			Object.defineProperty(navigator, "mediaDevices", {
				value: {},
				writable: true,
			});
		}

		// Mock the enumerateDevices method
		navigator.mediaDevices.enumerateDevices = vi.fn().mockResolvedValue([]);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("should render correctly", () => {
		act(() => {
			render(<ScanPage />);
		});
	});
});
