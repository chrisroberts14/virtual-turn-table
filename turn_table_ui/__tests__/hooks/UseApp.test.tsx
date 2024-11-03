import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react";
import { vi } from "vitest";
import GetUserInfo from "../../src/api_calls/GetUserInfo";
import useApp from "../../src/hooks/UseApp";
import type Album from "../../src/interfaces/Album";
import { getStateData } from "../../src/interfaces/StateData";

vi.mock("../../src/interfaces/StateData");
vi.mock("../../src/api_calls/GetUserInfo");

describe("UseApp", () => {
	it("should initialise properly when not logged in", () => {
		// @ts-ignore
		(getStateData as vi.mock).mockReturnValue({ currentPage: "play" });
		const { result } = renderHook(() => useApp());
		expect(result.current.isSignedIn).toBe(false);
		expect(result.current.nextPage).toBe("scan");
		expect(result.current.token).toBe(null);
	});

	it("should initialise properly when logged in with valid token", () => {
		// @ts-ignore
		(getStateData as vi.mock).mockReturnValue({
			currentPage: "play",
			spotify_access_token: "test_token",
			spotify_session_length: "3600",
			spotify_login_time: new Date().toISOString(),
		});
		const { result } = renderHook(() => useApp());
		expect(result.current.isSignedIn).toBe(true);
		expect(result.current.nextPage).toBe("scan");
		expect(result.current.token).toBe("test_token");
	});

	it("should initialise properly when params are supplied in the URL", () => {
		const originalLocation = window.location;
		Object.defineProperty(window, "location", {
			value: {
				hash: "?access_token=test_token&expires_in=3600",
			},
			writable: true,
		});
		// @ts-ignore
		(GetUserInfo as vi.mock).mockReturnValue(Promise.resolve({ data: "test" }));
		const { result } = renderHook(() => useApp());
		expect(result.current.isSignedIn).toBe(true);
		expect(result.current.token).toBe("test_token");
		Object.defineProperty(window, "location", {
			value: originalLocation,
			writable: true,
		});
	});

	it("should initialise properly when the session has expired", () => {
		const pastDate: Date = new Date(99);
		// @ts-ignore
		(getStateData as vi.mock).mockReturnValue({
			currentPage: "play",
			spotify_access_token: "test_token",
			spotify_session_length: "3600",
			spotify_login_time: pastDate.toISOString(),
		});
		const { result } = renderHook(() => useApp());
		waitFor(() => {
			expect(result.current.isSignedIn).toBe(false);
			expect(result.current.token).toBe(null);
		});
	});

	it("should move to play page when currentAlbum is changed", () => {
		const { result } = renderHook(() => useApp());
		act(() => {
			result.current.setCurrentAlbum({} as Album);
		});
		waitFor(() => {
			expect(result.current.nextPage).toBe("play");
		});
	});
});
