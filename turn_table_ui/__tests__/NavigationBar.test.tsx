import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import NavigationBar from "../src/components/NavigationBar";
import { useError } from "../src/contexts/ErrorContext";
import { useNavigation } from "../src/contexts/NavigationContext";
import { useUsername } from "../src/contexts/UsernameContext";

describe("Navigation Bar", () => {
	it("renders the navigation bar with the logo and title", () => {
		// @ts-ignore
		(useNavigation as vi.Mock).mockReturnValue({
			nextPage: "play",
			setNextPage: vi.fn(),
			isSignedIn: false,
		});

		render(<NavigationBar />);

		// Assert that the logo and title are rendered
		expect(screen.getByText("Virtual Turn Table")).toBeInTheDocument();
	});

	it("renders Play and Scan tabs", () => {
		// @ts-ignore
		(useNavigation as vi.Mock).mockReturnValue({
			nextPage: "play",
			setNextPage: vi.fn(),
			isSignedIn: false,
		});

		render(<NavigationBar />);

		// Assert that both tabs are rendered
		expect(screen.getByRole("tab", { name: /Play/i })).toBeInTheDocument();
		expect(screen.getByRole("tab", { name: /Scan/i })).toBeInTheDocument();
	});

	it("calls setNextPage when a tab is clicked", () => {
		const mockSetNextPage = vi.fn();
		// @ts-ignore
		(useNavigation as vi.Mock).mockReturnValue({
			nextPage: "play",
			setNextPage: mockSetNextPage,
			isSignedIn: false,
		});

		render(<NavigationBar />);

		// Simulate a click on the Scan tab
		fireEvent.click(screen.getByRole("tab", { name: /Scan/i }));

		// Assert that setNextPage is called with "scan"
		expect(mockSetNextPage).toHaveBeenCalledWith("scan");
	});

	it("renders UserBox when signed in, otherwise renders Login", () => {
		// Case when user is signed in
		// @ts-ignore
		(useNavigation as vi.Mock).mockReturnValue({
			nextPage: "play",
			setNextPage: vi.fn(),
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

		const { rerender } = render(<NavigationBar />);
		expect(screen.getByText(/User/i)).toBeInTheDocument(); // Adjust for UserBox content

		// Case when user is not signed in
		// @ts-ignore
		(useNavigation as vi.Mock).mockReturnValue({
			nextPage: "play",
			setNextPage: vi.fn(),
			isSignedIn: false,
		});

		rerender(<NavigationBar />);
		expect(screen.getByText(/Login/i)).toBeInTheDocument();
	});
});
