import { render } from "@testing-library/react";
import { vi } from "vitest";
import App from "../src/App";
import useApp from "../src/hooks/UseApp";

vi.mock("../src/hooks/UseApp.tsx");

describe("App", () => {
	beforeEach(() => {
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

	it("should render without being logged in", () => {
		// @ts-ignore
		(useApp as vi.mock).mockReturnValue({
			isSignedIn: false,
			setIsSignedIn: vi.fn(),
			currentAlbum: null,
			setCurrentAlbum: vi.fn(),
			token: null,
			setToken: vi.fn(),
			nextPage: "",
			setNextPage: vi.fn(),
			fadeScan: false,
			fadePlayer: false,
			disableTabChange: false,
			setDisableTabChange: vi.fn(),
		});
		render(<App />);
	});

	it("should render with being logged in", () => {
		// @ts-ignore
		(useApp as vi.mock).mockReturnValue({
			isSignedIn: true,
			setIsSignedIn: vi.fn(),
			currentAlbum: null,
			setCurrentAlbum: vi.fn(),
			token: null,
			setToken: vi.fn(),
			currentPage: "",
			setCurrentPage: vi.fn(),
			fadeScan: false,
			fadePlayer: false,
			disableTabChange: false,
			setDisableTabChange: vi.fn(),
		});
		render(<App />);
	});
});
