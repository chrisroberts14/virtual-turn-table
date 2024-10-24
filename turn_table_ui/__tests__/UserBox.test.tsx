import { prettyDOM, render, screen, waitFor } from "@testing-library/react";
import { useContext } from "react";
import { describe, expect, it, vi } from "vitest";
import CreateUser from "../src/api_calls/CreateUser";
import GetUserInfo from "../src/api_calls/GetUserInfo";
import UserBox from "../src/components/UserBox";
import { ErrorProvider, useError } from "../src/contexts/ErrorContext";
import { useNavigation } from "../src/contexts/NavigationContext";
import { UsernameContext, useUsername } from "../src/contexts/UsernameContext";
import { getStateData } from "../src/interfaces/StateData";

vi.mock("../src/api_calls/GetUserInfo");
vi.mock("../src/interfaces/StateData");
vi.mock("../src/api_calls/CreateUser");

describe("UserBox", () => {
	it("renders the user info when GetUserInfo returns valid data", async () => {
		vi.useFakeTimers();
		const setUsername = vi.fn();
		const username = "John Doe";

		(getStateData as vi.Mock).mockReturnValue({
			spotify_access_token: "valid_token",
		});

		(GetUserInfo as vi.Mock).mockResolvedValue({
			display_name: "John Doe",
			email: "john@example.com",
			image_url: "http://example.com/john.jpg",
		});

		(CreateUser as vi.Mock).mockResolvedValue();

		const rend = render(
			<ErrorProvider>
				<UsernameContext.Provider value={{ username, setUsername }}>
					<UserBox />
				</UsernameContext.Provider>
			</ErrorProvider>,
		);

		console.log(prettyDOM(rend.container));

		await waitFor(() => {
			expect(screen.getByText("John Doe")).toBeInTheDocument();
		});
	}, 10000);
});
