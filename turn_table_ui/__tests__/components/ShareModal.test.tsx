import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import ShareModal from "../../src/components/ShareModal";
import "@testing-library/jest-dom";
import GetUsersBySearch from "../../src/api_calls/GetUsersBySearch";
import ShareCollection from "../../src/api_calls/ShareCollection";
import { useError } from "../../src/contexts/ErrorContext";
import { useShare } from "../../src/contexts/ShareContext";
import { useSpotifyToken } from "../../src/contexts/SpotifyTokenContext";
import { useSuccess } from "../../src/contexts/SuccessContext";
import { useUsername } from "../../src/contexts/UsernameContext";

vi.mock("../../src/contexts/UsernameContext");
vi.mock("../../src/contexts/ErrorContext");
vi.mock("../../src/contexts/SpotifyTokenContext");
vi.mock("../../src/api_calls/GetUsersBySearch");
vi.mock("../../src/api_calls/ShareCollection");
vi.mock("../../src/contexts/ShareContext");
vi.mock("../../src/contexts/SuccessContext");

describe("ShareModal", () => {
	beforeEach(() => {
		// @ts-ignore
		(useUsername as vi.mock).mockReturnValue({
			username: "username",
		});

		// @ts-ignore
		(useError as vi.mock).mockReturnValue({
			showError: vi.fn(),
		});

		// @ts-ignore
		(useSpotifyToken as vi.mock).mockReturnValue({
			token: "token",
		});

		// @ts-ignore
		(GetUsersBySearch as vi.mock).mockImplementation(() => Promise.resolve([]));

		// @ts-ignore
		(useShare as vi.mock).mockReturnValue({
			shareInputValue: "",
			setShareInputValue: vi.fn(),
			isShareModalOpen: true,
			setIsShareModalOpen: vi.fn(),
		});

		// @ts-ignore
		(useSuccess as vi.mock).mockReturnValue({
			showSuccess: vi.fn(),
		});
	});

	it("should render ShareModal", () => {
		render(<ShareModal />);
		expect(screen.getByTitle("Share button")).toBeInTheDocument();
	});

	it("on close should set isOpen to false and clear input value", async () => {
		render(<ShareModal />);
		fireEvent.click(screen.getByRole("button", { name: /close/i }));
		await waitFor(() => {
			expect(useShare().setIsShareModalOpen).toHaveBeenCalledWith(false);
		});
	});

	it("should call showError if share collection fails", async () => {
		// @ts-ignore
		(ShareCollection as vi.mock).mockImplementation(() => Promise.reject());

		// @ts-ignore
		(useShare as vi.mock).mockReturnValue({
			shareInputValue: "username",
			setShareInputValue: vi.fn(),
			isShareModalOpen: true,
			setIsShareModalOpen: vi.fn(),
		});

		render(<ShareModal />);
		await waitFor(() => {
			expect(screen.getByTitle("Share button")).toBeInTheDocument();
			fireEvent.click(screen.getByTitle("Share button"));
		});

		await waitFor(() => {
			expect(useError().showError).toHaveBeenCalledWith(
				"Failed to share collection",
			);
		});
	});
});
