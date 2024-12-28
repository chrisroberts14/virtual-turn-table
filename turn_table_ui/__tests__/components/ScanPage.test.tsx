import { render } from "@testing-library/react";
import { act } from "react";
import { vi } from "vitest";
import GetUserAlbums from "../../src/api_calls/GetUserAlbums";
import ScanPage from "../../src/components/ScanPage";
import { useError } from "../../src/contexts/ErrorContext";
import { useMusic } from "../../src/contexts/MusicContext";
import { NavigationContext } from "../../src/contexts/NavigationContext";
import { useSpotifyToken } from "../../src/contexts/SpotifyTokenContext";
import { useUsername } from "../../src/contexts/UsernameContext";
import { WebSocketContext } from "../../src/contexts/WebSocketContext";

vi.mock("../../src/contexts/UsernameContext");
vi.mock("../../src/contexts/MusicContext");
vi.mock("../../src/contexts/ErrorContext");
vi.mock("../../src/contexts/SpotifyTokenContext");
vi.mock("../../src/api_calls/GetUserAlbums");

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

		// @ts-ignore
		(GetUserAlbums as vi.mock).mockReturnValue(Promise.resolve([]));

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
		const mockSetWebSocket = vi.fn();
		act(() => {
			render(
				<WebSocketContext.Provider
					value={{ ws: null, setWs: mockSetWebSocket }}
				>
					<NavigationContext.Provider
						value={{
							isSignedIn: true,
							setIsSignedIn: vi.fn(),
							currentPage: 0,
							setCurrentPage: vi.fn(),
						}}
					>
						<ScanPage />
					</NavigationContext.Provider>
				</WebSocketContext.Provider>,
			);
		});
	});
});
