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

vi.mock("../../src/contexts/NavigationContext");
vi.mock("../../src/contexts/ErrorContext");
vi.mock("../../src/contexts/UsernameContext");
vi.mock("../../src/api_calls/GetUserAlbums");
vi.mock("../../src/api_calls/GetIsCollectionPublic");
vi.mock("../../src/api_calls/GetNotifications");

class WebSocketMock {
	private url: string;
	private readyState: number;
	public onopen: () => void;
	public onmessage: (event: { data: string }) => void;
	public onerror: () => void;
	public onclose: () => void;

	constructor(url: string) {
		this.url = url;
		this.readyState = 1; // Open
		this.onopen = vi.fn();
		this.onmessage = vi.fn();
		this.onerror = vi.fn();
		this.onclose = vi.fn();
	}

	send(data: string) {
		// You can add functionality to handle data sent to the mock
		this.onmessage({ data });
	}

	close() {
		this.readyState = 3; // Closed
		this.onclose();
	}
}

describe("Navigation Bar", () => {
	beforeEach(() => {
		// @ts-ignore
		(useError as vi.Mock).mockReturnValue({ useError: vi.fn() });

		// @ts-ignore
		(useUsername as vi.Mock).mockReturnValue({ useUsername: vi.fn() });

		// @ts-ignore
		(GetUserAlbums as vi.Mock).mockReturnValue(Promise.resolve([]));

		// @ts-ignore
		(GetIsCollectionPublic as vi.Mock).mockReturnValue(Promise.resolve(false));
	});

	it("renders the navigation bar with the logo and title", () => {
		// @ts-ignore
		(useNavigation as vi.Mock).mockReturnValue({
			currentPage: 0,
			setCurrentPage: vi.fn(),
			isSignedIn: true,
		});

		render(<NavigationBar />);

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

		render(<NavigationBar />);

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

		render(<NavigationBar />);

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

		const { rerender } = render(<NavigationBar />);
		expect(screen.getByText(/User/i)).toBeInTheDocument();

		// Case when user is not signed in
		// @ts-ignore
		(useNavigation as vi.Mock).mockReturnValue({
			currentPage: 0,
			setNextPage: vi.fn(),
			isSignedIn: false,
		});

		rerender(<NavigationBar />);
		expect(screen.getByText(/Login/i)).toBeInTheDocument();
	});
});
