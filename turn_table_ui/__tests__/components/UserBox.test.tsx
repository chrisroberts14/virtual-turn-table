import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CreateUser from "../../src/api_calls/CreateUser";
import GetUserInfo from "../../src/api_calls/GetUserInfo";
import UserBox from "../../src/components/UserBox";
import { useError } from "../../src/contexts/ErrorContext";
import { UsernameContext } from "../../src/contexts/UsernameContext";
import { clearStateData, getStateData } from "../../src/interfaces/StateData";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import GetUserAlbums from "../../src/api_calls/GetUserAlbums";

vi.mock("../../src/api_calls/GetUserInfo");
vi.mock("../../src/interfaces/StateData");
vi.mock("../../src/api_calls/CreateUser");
vi.mock("../../src/contexts/ErrorContext");
vi.mock("../../src/api_calls/GetUserAlbums");

describe("UserBox", () => {
	const setUsername = vi.fn();
	const username = "John Doe";
	const mockShowError = vi.fn();
	const clearStateDataMock = vi.fn();

	beforeEach(() => {
		// @ts-ignore
		(useError as vi.Mock).mockReturnValue({ showError: mockShowError });

		// @ts-ignore
		(GetUserInfo as vi.Mock).mockResolvedValue({
			display_name: "John Doe",
			image_url: "https://example.com/john.jpg",
		});

		// @ts-ignore
		(getStateData as vi.Mock).mockReturnValue({
			spotify_access_token: "valid_token",
		});

		// @ts-ignore
		(CreateUser as vi.Mock).mockResolvedValue();

		// @ts-ignore
		(clearStateData as vi.Mock).mockImplementation(clearStateDataMock);

		// @ts-ignore
		(GetUserAlbums as vi.Mock).mockReturnValue(Promise.resolve([]));
	});

	it("renders the user info when GetUserInfo returns valid data", async () => {
		render(
			<UsernameContext.Provider value={{ username, setUsername }}>
				<UserBox />
			</UsernameContext.Provider>,
		);

		await waitFor(() => {
			expect(screen.getByText("John Doe")).toBeInTheDocument();
		});
	});

	it("should logout if get user info fails", async () => {
		// @ts-ignore
		(GetUserInfo as vi.Mock).mockRejectedValue(
			new Error("Failed to get user info"),
		);

		render(
			<UsernameContext.Provider value={{ username, setUsername }}>
				<UserBox />
			</UsernameContext.Provider>,
		);
		await waitFor(() => {
			expect(clearStateDataMock).toHaveBeenCalled();
		});
	});

	it("should logout when logout button is clicked", async () => {
		render(
			<UsernameContext.Provider value={{ username, setUsername }}>
				<UserBox />
			</UsernameContext.Provider>,
		);

		await userEvent.click(screen.getByText("John Doe")); // Opens the dropdown
		await userEvent.click(screen.getByText("Logout")); // Clicks the logout button

		expect(clearStateDataMock).toHaveBeenCalled();
	});
});
