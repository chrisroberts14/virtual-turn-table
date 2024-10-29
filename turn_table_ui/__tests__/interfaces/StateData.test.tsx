import { waitFor } from "@testing-library/react";
import { vi } from "vitest";
import {
	type StateData,
	clearStateData,
	getStateData,
	storeStateData,
} from "../../src/interfaces/StateData";

describe("StateData", () => {
	const mockSet = vi.fn();
	const mockGet = vi.fn();
	const mockRemove = vi.fn();
	const mockStateData = { currentPage: "scan" } as StateData;

	beforeEach(() => {
		localStorage.setItem = mockSet;
		localStorage.getItem = mockGet;
		localStorage.removeItem = mockRemove;
	});

	afterEach(() => {
		mockGet.mockReset();
	});

	it("should store the data if there is no old state", () => {
		// @ts-ignore
		(mockGet as vi.mock).mockReturnValue(null);
		storeStateData(mockStateData);
		waitFor(() => {
			expect(mockSet).toHaveBeenCalledWith(
				"virtual_turn_table_state",
				JSON.stringify({ currentPage: "scan" }),
			);
		});
	});

	it("should merge the new state with the old state", () => {
		// @ts-ignore
		(mockGet as vi.mock).mockReturnValue(
			JSON.stringify({ spotify_access_token: "test_token" }),
		);
		storeStateData(mockStateData);
		waitFor(() => {
			expect(mockSet).toHaveBeenCalledWith(
				"virtual_turn_table_state",
				JSON.stringify({
					currentPage: "scan",
					spotify_access_token: "test_token",
				}),
			);
		});
	});

	it("should return the state data", () => {
		// @ts-ignore
		(mockGet as vi.mock).mockReturnValue(
			JSON.stringify({ currentPage: "scan" }),
		);
		expect(getStateData()).toEqual({ currentPage: "scan" });
	});

	it("should return null if no data is stored", () => {
		// @ts-ignore
		(mockGet as vi.mock).mockReturnValue(null);
		waitFor(() => {
			expect(getStateData()).toBeNull();
		});
	});

	it("should clear the state data", () => {
		clearStateData();
		waitFor(() => {
			expect(mockRemove).toHaveBeenCalledWith("virtual_turn_table_state");
		});
	});
});
