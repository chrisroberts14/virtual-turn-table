import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import UploadFile from "../../src/api_calls/UploadFile";
import Upload from "../../src/components/Upload";
import { useUpload } from "../../src/contexts/CaptureContext";
import { useError } from "../../src/contexts/ErrorContext";

vi.mock("../../src/contexts/CaptureContext");
vi.mock("../../src/contexts/ErrorContext");
vi.mock("../../src/api_calls/UploadFile");

const mockFile = new File([""], "test.png", { type: "image/png" });

describe("Upload", () => {
	const mockShowError = vi.fn();

	beforeEach(() => {
		// @ts-ignore
		useUpload.mockReturnValue({
			setIsUploading: vi.fn(),
			setScannedAlbum: vi.fn(),
			isUploading: false,
		});
		// @ts-ignore
		useError.mockReturnValue({ showError: mockShowError });
		// @ts-ignore
		UploadFile.mockReturnValue(Promise.resolve());
	});

	it("should render", () => {
		render(<Upload triggerConfirmSlide={vi.fn()} />);
	});

	it("should correctly upload a file", async () => {
		const triggerConfirmSlide = vi.fn();
		render(<Upload triggerConfirmSlide={triggerConfirmSlide} />);
		const fileSelector = screen.getByTitle("Upload file input");
		await userEvent.upload(fileSelector, mockFile);
		const uploadButton = screen.getByText("Upload a file");
		await userEvent.click(uploadButton);

		await waitFor(() => {
			expect(triggerConfirmSlide).toHaveBeenCalled();
			expect(UploadFile).toHaveBeenCalledWith(mockFile, expect.any(Function));
		});
	});

	it("should show an error if the upload fails", async () => {
		// @ts-ignore
		(UploadFile as vi.mock).mockRejectedValue(new Error("Upload failed"));
		render(<Upload triggerConfirmSlide={vi.fn()} />);
		const fileSelector = screen.getByTitle("Upload file input");
		await userEvent.upload(fileSelector, mockFile);
		const uploadButton = screen.getByText("Upload a file");
		await userEvent.click(uploadButton);

		await waitFor(() => {
			expect(mockShowError).toHaveBeenCalledWith("Upload failed");
		});
	});
});
