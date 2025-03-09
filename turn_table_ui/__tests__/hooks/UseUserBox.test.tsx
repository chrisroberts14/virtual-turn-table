import { renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import GetUserInfo from "../../src/api_calls/GetUserInfo";
import { useUsername } from "../../src/contexts/UsernameContext";
import UseUserBox from "../../src/hooks/UseUserBox";
import { clearStateData, getStateData } from "../../src/interfaces/StateData";

vi.mock("../../src/contexts/UsernameContext");
vi.mock("../../src/interfaces/StateData");
vi.mock("../../src/api_calls/GetUserInfo");

describe("UseUserBox", () => {
	const mockSetUsername = vi.fn();

	beforeAll(() => {
		// @ts-ignore
		(useUsername as vi.mock).mockReturnValue({
			username: "test",
			setUsername: mockSetUsername,
		});

		// @ts-ignore
		(clearStateData as vi.mock).mockReturnValue();
	});

	it("should return a user box", () => {
		const { result } = renderHook(() => UseUserBox());
		expect(result.current).toEqual({
			profileImage: undefined,
			username: "test",
			logout: expect.any(Function),
			isCollectionPublic: false,
			setIsCollectionPublic: expect.any(Function),
		});
	});

	it("should clear state data on logout", () => {
		const { result } = renderHook(() => UseUserBox());
		result.current.logout();
		expect(clearStateData).toHaveBeenCalled();
	});

	it("should update on setUsername change", async () => {
		// @ts-ignore
		(getStateData as vi.mock).mockReturnValue({ bff_token: "test" });
		// @ts-ignore
		(GetUserInfo as vi.mock).mockReturnValue(
			Promise.resolve({
				display_name: "new test",
				image_url: "test",
				is_collection_public: true,
			}),
		);

		const { result } = renderHook(() => UseUserBox());
		mockSetUsername("new test");
		await waitFor(() => {
			expect(result.current.profileImage).toEqual("test");
			expect(result.current.isCollectionPublic).toEqual(true);
		});
	});

	it("should logout if GetUserInfo fails", async () => {
		// @ts-ignore
		(getStateData as vi.mock).mockReturnValue({ bff_token: "test" });
		// @ts-ignore
		(GetUserInfo as vi.mock).mockReturnValue(Promise.reject());

		renderHook(() => UseUserBox());
		await waitFor(() => {
			expect(clearStateData).toHaveBeenCalled();
		});
	});
});
