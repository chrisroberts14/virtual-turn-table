import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import NavigationBar from "../../src/components/NavigationBar";
import { useError } from "../../src/contexts/ErrorContext";
import { useNavigation } from "../../src/contexts/NavigationContext";
import { useUsername } from "../../src/contexts/UsernameContext";
import "@testing-library/jest-dom";
import GetIsCollectionPublic from "../../src/api_calls/GetIsCollectionPublic";
import GetNotifications from "../../src/api_calls/GetNotifications";
import GetUserAlbums from "../../src/api_calls/GetUserAlbums";
import { BFFTokenContext } from "../../src/contexts/BFFTokenContext";
import { useSuccess } from "../../src/contexts/SuccessContext";
import WebSocketMock from "../utils/WebSocketMock";

vi.mock("../../src/contexts/NavigationContext");
vi.mock("../../src/contexts/ErrorContext");
vi.mock("../../src/contexts/UsernameContext");
vi.mock("../../src/api_calls/GetUserAlbums");
vi.mock("../../src/api_calls/GetIsCollectionPublic");
vi.mock("../../src/api_calls/GetNotifications");
vi.mock("../../src/contexts/SuccessContext");

describe("Navigation Bar", () => {
	beforeEach(() => {
		// @ts-ignore
		(useError as vi.Mock).mockReturnValue({ useError: vi.fn() });

		// @ts-ignore
		(useSuccess as vi.Mock).mockReturnValue({ useSuccess: vi.fn() });

		// @ts-ignore
		(useUsername as vi.Mock).mockReturnValue({ useUsername: vi.fn() });

		// @ts-ignore
		(GetUserAlbums as vi.Mock).mockReturnValue(Promise.resolve([]));

		// @ts-ignore
		(GetIsCollectionPublic as vi.Mock).mockReturnValue(Promise.resolve(false));

		// @ts-ignore
		(GetNotifications as vi.Mock).mockReturnValue(Promise.resolve([]));
	});

	it("renders the navigation bar with the logo and title", () => {
		// @ts-ignore
		(useNavigation as vi.Mock).mockReturnValue({
			currentPage: 0,
			setCurrentPage: vi.fn(),
			isSignedIn: true,
		});
		render(
			<BFFTokenContext.Provider
				value={{ BFFToken: "test_token", setBFFToken: vi.fn() }}
			>
				<NavigationBar />
			</BFFTokenContext.Provider>,
		);

		// Assert that the logo and title are rendered
		expect(screen.getByText("Virtual Turn Table")).toBeInTheDocument();
	});

	it("renders Play and Scan tabs", () => {
		// @ts-ignore
		(useNavigation as vi.Mock).mockReturnValue({
			currentPage: 0,
			setCurrentPage: vi.fn(),
			isSignedIn: true,
		});

		render(
			<BFFTokenContext.Provider
				value={{ BFFToken: "test_token", setBFFToken: vi.fn() }}
			>
				<NavigationBar />
			</BFFTokenContext.Provider>,
		);

		// Assert that all tabs are rendered
		expect(screen.getByRole("tab", { name: /Play/i })).toBeInTheDocument();
		expect(screen.getByRole("tab", { name: /Scan/i })).toBeInTheDocument();
		expect(screen.getByRole("tab", { name: /Social/i })).toBeInTheDocument();
	});

	it("calls setCurrentPage when a tab is clicked", () => {
		const mockSetCurrentPage = vi.fn();
		// @ts-ignore
		(useNavigation as vi.Mock).mockReturnValue({
			currentPage: 0,
			setCurrentPage: mockSetCurrentPage,
			isSignedIn: true,
		});

		render(
			<BFFTokenContext.Provider
				value={{ BFFToken: "test_token", setBFFToken: vi.fn() }}
			>
				<NavigationBar />
			</BFFTokenContext.Provider>,
		);

		// Simulate a click on the Scan tab
		fireEvent.click(screen.getByRole("tab", { name: /Scan/i }));

		waitFor(() => {
			expect(mockSetCurrentPage).toHaveBeenCalledWith(1);
		});
	});

	it("renders UserBox when signed in, otherwise renders Login", () => {
		// @ts-ignore
		global.WebSocket = WebSocketMock;

		// Case when user is signed in
		// @ts-ignore
		(useNavigation as vi.Mock).mockReturnValue({
			currentPage: 0,
			setCurrentPage: vi.fn(),
			isSignedIn: true,
		});

		// @ts-ignore
		(useError as vi.Mock).mockReturnValue({
			error: null,
		});

		// @ts-ignore
		(useUsername as vi.Mock).mockReturnValue({
			username: "test_user",
		});

		// @ts-ignore
		(GetNotifications as vi.Mock).mockReturnValue(Promise.resolve([]));

		render(
			<BFFTokenContext.Provider
				value={{ BFFToken: "test_token", setBFFToken: vi.fn() }}
			>
				<NavigationBar />
			</BFFTokenContext.Provider>,
		);
		expect(screen.getByText(/User/i)).toBeInTheDocument();

		// Case when user is not signed in
		// @ts-ignore
		(useNavigation as vi.Mock).mockReturnValue({
			currentPage: 0,
			setNextPage: vi.fn(),
			isSignedIn: false,
		});

		render(
			<BFFTokenContext.Provider
				value={{ BFFToken: "test_token", setBFFToken: vi.fn() }}
			>
				<NavigationBar />
			</BFFTokenContext.Provider>,
		);
		expect(screen.getByText(/Login/i)).toBeInTheDocument();
	});
});
