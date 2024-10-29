import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { MusicContext, useMusic } from "../../src/contexts/MusicContext";

describe("useMusic", () => {
	it("should provide context value when used within MusicProvider", () => {
		const wrapper = ({ children }) => (
			<MusicContext.Provider
				value={{ currentAlbum: null, setCurrentAlbum: vi.fn() }}
			>
				{children}
			</MusicContext.Provider>
		);

		const { result } = renderHook(() => useMusic(), { wrapper });

		expect(result.current).toBeDefined();
	});

	it("should throw an error when used outside MusicProvider", () => {
		expect(() => renderHook(() => useMusic())).toThrow(
			"useMusic must be used within a MusicProvider",
		);
	});
});
