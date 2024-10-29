import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { UploadContext, useUpload } from "../../src/contexts/UploadContext";

describe("useCapture", () => {
	it("should provide context value when used within UploadContext Provider", () => {
		const wrapper = ({ children }) => (
			<UploadContext.Provider
				value={{
					isUploading: false,
					setIsUploading: vi.fn(),
					scannedAlbum: null,
					setScannedAlbum: vi.fn(),
					fadeConfirm: false,
					setFadeConfirm: vi.fn(),
					currentImage: null,
					setCurrentImage: vi.fn(),
				}}
			>
				{children}
			</UploadContext.Provider>
		);

		const { result } = renderHook(() => useUpload(), { wrapper });

		expect(result.current).toBeDefined();
	});

	it("should throw an error when used outside upload", () => {
		// Check that the hook throws an error when used without the provider
		expect(() => renderHook(() => useUpload())).toThrow(
			"useUpload must be used within an UploadProvider",
		);
	});
});
