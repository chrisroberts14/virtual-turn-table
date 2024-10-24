import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CreateUser from "../src/api_calls/CreateUser";
import GetUserInfo from "../src/api_calls/GetUserInfo";
import UserBox from "../src/components/UserBox";
import { ErrorProvider } from "../src/contexts/ErrorContext";
import { UsernameContext } from "../src/contexts/UsernameContext";
import { getStateData } from "../src/interfaces/StateData";

vi.mock("../src/contexts/ErrorContext");
vi.mock("../src/api_calls/GetUserInfo");
vi.mock("../src/api_calls/CreateUser");
vi.mock("../src/interfaces/StateData");

describe("UserBox", () => {
	it("renders the user info when GetUserInfo returns valid data", async () => {
		const mockGetUserInfo = vi.fn(GetUserInfo);
		const mockCreateUser = vi.mocked(CreateUser);
		const setUsername = vi.fn();
		const mockGetStateData = vi.fn(getStateData);
		const username = "";

		mockGetStateData.mockReturnValue({ spotify_access_token: "valid_token" });
		mockGetUserInfo.mockResolvedValue({
			display_name: "John Doe",
			email: "john@example.com",
			image_url: "http://example.com/john.jpg",
		});
		vi.mock("@/contexts/UsernameContext", () => ({
			username: "John Doe",
			setUsername: setUsername,
		}));

		// Render the component
		render(
			<ErrorProvider>
				<UsernameContext.Provider value={{ username, setUsername }}>
					<UserBox />
				</UsernameContext.Provider>
			</ErrorProvider>,
		);

		// Wait for the effect to set the user data
		await waitFor(() => {
			expect(screen.getByText("John Doe")).toBeInTheDocument();
			expect(screen.getByText("john@example.com")).toBeInTheDocument();
			expect(screen.getByRole("img")).toHaveAttribute(
				"src",
				"http://example.com/john.jpg",
			);
		});

		// Ensure CreateUser is called with username and email
		expect(mockCreateUser).toHaveBeenCalledWith("John Doe", "john@example.com");
	});
});
