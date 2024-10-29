import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import {
	UsernameContext,
	useUsername,
} from "../../src/contexts/UsernameContext";

describe("UsernameContext", () => {
	it("should provide context values when used in a Username context", () => {
		const wrapper = ({ children }) => (
			<UsernameContext.Provider
				value={{
					username: "test",
					setUsername: vi.fn(),
				}}
			>
				{children}
			</UsernameContext.Provider>
		);

		const { result } = renderHook(() => useUsername(), { wrapper });

		expect(result.current).toBeDefined();
	});

	it("should throw an error when used outside a Username context", () => {
		expect(() => renderHook(() => useUsername())).toThrow(
			"useUsername must be used within a UsernameProvider",
		);
	});
});
