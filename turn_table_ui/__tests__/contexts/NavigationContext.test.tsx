import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import {
	NavigationContext,
	useNavigation,
} from "../../src/contexts/NavigationContext";

describe("useNavigation", () => {
	it("should provide context value when used within NavigationProvider", () => {
		const wrapper = ({ children }) => (
			<NavigationContext.Provider
				value={{
					isSignedIn: false,
					setIsSignedIn: vi.fn(),
					nextPage: "",
					setNextPage: vi.fn(),
					disableTabChange: false,
					setDisableTabChange: vi.fn(),
				}}
			>
				{children}
			</NavigationContext.Provider>
		);

		const { result } = renderHook(() => useNavigation(), { wrapper });

		expect(result.current).toBeDefined();
	});

	it("should throw an error when used outside NavigationProvider", () => {
		expect(() => renderHook(() => useNavigation())).toThrow(
			"useNavigation must be used within a NavigationProvider",
		);
	});
});
