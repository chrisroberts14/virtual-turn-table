import { vi } from "vitest";
import ErrorDisplay from "../../src/components/ErrorDisplay";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useError } from "../../src/contexts/ErrorContext";

vi.mock("../../src/contexts/ErrorContext");

describe("ErrorDisplay", () => {
	const clearErrorMock = vi.fn();

	beforeEach(() => {
		// @ts-ignore
		(useError as vi.Mock).mockReturnValue({
			error: "An error occurred",
			clearError: clearErrorMock,
		});
	});

	it("should show a message if error is defined", () => {
		render(<ErrorDisplay />);
		expect(screen.getByText("An error occurred")).toBeInTheDocument();
	});

	it("should not show a message if error is not defined", () => {
		// @ts-ignore
		(useError as vi.Mock).mockReturnValue({ error: null, clearError: vi.fn() });
		render(<ErrorDisplay />);
		expect(screen.queryByText("An error occurred")).not.toBeInTheDocument();
	});

	it("should call clearError when the close button is clicked", async () => {
		render(<ErrorDisplay />);
		await userEvent.click(screen.getByTitle("close"));
		await waitFor(() => {
			expect(clearErrorMock).toHaveBeenCalled();
		});
	});
});
