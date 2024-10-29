import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import {
	SpotifyTokenContext,
	useSpotifyToken,
} from "../../src/contexts/SpotifyTokenContext";

describe("SpotifyTokenContext", () => {
	it("should provide context values when used in a SpotifyToken context", () => {
		const wrapper = ({ children }) => (
			<SpotifyTokenContext.Provider
				value={{
					token: "test",
					setToken: vi.fn(),
				}}
			>
				{children}
			</SpotifyTokenContext.Provider>
		);

		const { result } = renderHook(() => useSpotifyToken(), { wrapper });

		expect(result.current).toBeDefined();
	});

	it("should throw an error when used outside a SpotifyToken context", () => {
		expect(() => renderHook(() => useSpotifyToken())).toThrow(
			"useSpotifyToken must be used within a SpotifyTokenProvider",
		);
	});
});
