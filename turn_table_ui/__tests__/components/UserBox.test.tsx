import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CreateUser from "../../src/api_calls/CreateUser";
import GetUserInfo from "../../src/api_calls/GetUserInfo";
import UserBox from "../../src/components/UserBox";
import { ErrorProvider } from "../../src/contexts/ErrorContext";
import { UsernameContext } from "../../src/contexts/UsernameContext";
import { getStateData } from "../../src/interfaces/StateData";
import "@testing-library/jest-dom";

vi.mock("../../src/api_calls/GetUserInfo");
vi.mock("../../src/interfaces/StateData");
vi.mock("../../src/api_calls/CreateUser");

describe("UserBox", () => {
	it("renders the user info when GetUserInfo returns valid data", async () => {
		const setUsername = vi.fn();
		const username = "John Doe";

		// @ts-ignore
		(getStateData as vi.Mock).mockReturnValue({
			spotify_access_token: "valid_token",
		});

		// @ts-ignore
		(GetUserInfo as vi.Mock).mockResolvedValue({
			display_name: "John Doe",
			email: "john@example.com",
			image_url: "https://example.com/john.jpg",
		});

		// @ts-ignore
		(CreateUser as vi.Mock).mockResolvedValue();

		render(
			<ErrorProvider>
				<UsernameContext.Provider value={{ username, setUsername }}>
					<UserBox />
				</UsernameContext.Provider>
			</ErrorProvider>,
		);

		await waitFor(() => {
			expect(screen.getByText("John Doe")).toBeInTheDocument();
			expect(screen.getByText("john@example.com")).toBeInTheDocument();
		});
	}, 10000);
});
