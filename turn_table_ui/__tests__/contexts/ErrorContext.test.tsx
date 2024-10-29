import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react";
import { vi } from "vitest";
import { ErrorProvider, useError } from "../../src/contexts/ErrorContext";

describe("useCapture", () => {
	it("should provide context value when used within AlbumSelectionProvider", () => {
		const wrapper = ({ children }) => <ErrorProvider>{children}</ErrorProvider>;

		const { result } = renderHook(() => useError(), { wrapper });

		expect(result.current).toBeDefined();
	});

	it("should throw an error when used outside upload", () => {
		// Check that the hook throws an error when used without the provider
		expect(() => renderHook(() => useError())).toThrow(
			"Invalid use of error context",
		);
	});

	it("should show error message", () => {
		const wrapper = ({ children }) => <ErrorProvider>{children}</ErrorProvider>;

		const { result } = renderHook(() => useError(), { wrapper });
		act(() => {
			result.current.showError("Error message");
		});
		waitFor(() => {
			expect(result.current.error).toBe("Error message");
		});
	});

	it("should clear error message", () => {
		const wrapper = ({ children }) => <ErrorProvider>{children}</ErrorProvider>;

		const { result } = renderHook(() => useError(), { wrapper });
		act(() => {
			result.current.showError("Error message");
		});
		waitFor(() => {
			expect(result.current.error).toBe("Error message");
		});
		act(() => {
			result.current.clearError();
		});
		waitFor(() => {
			expect(result.current.error).toBe(null);
		});
	});

	it("should clear the error after 5000ms", () => {
		vi.useFakeTimers();
		const wrapper = ({ children }) => <ErrorProvider>{children}</ErrorProvider>;

		const { result } = renderHook(() => useError(), { wrapper });
		act(() => {
			result.current.showError("Error message");
		});
		waitFor(() => {
			expect(result.current.error).toBe("Error message");
		});
		vi.advanceTimersByTime(5000);
		waitFor(() => {
			expect(result.current.error).toBe(null);
		});
	});
});
