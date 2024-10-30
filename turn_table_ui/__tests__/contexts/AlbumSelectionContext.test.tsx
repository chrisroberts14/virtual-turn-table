import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import {
	AlbumSelectionContext,
	useAlbumSelection,
} from "../../src/contexts/AlbumSelectionContext";

describe("useAlbumSelection", () => {
	it("should provide context value when used within AlbumSelectionProvider", () => {
		const wrapper = ({ children }) => (
			<AlbumSelectionContext.Provider
				value={{
					hoveredAlbum: null,
					setHoveredAlbum: vi.fn(),
					albums: null,
					setAlbums: vi.fn(),
				}}
			>
				{children}
			</AlbumSelectionContext.Provider>
		);

		const { result } = renderHook(() => useAlbumSelection(), { wrapper });

		expect(result.current).toBeDefined();
	});

	it("should throw an error when used outside AlbumSelectionProvider", () => {
		// Check that the hook throws an error when used without the provider
		expect(() => renderHook(() => useAlbumSelection())).toThrow(
			"useAlbumSelection must be used within an AlbumSelectionProvider",
		);
	});
});
